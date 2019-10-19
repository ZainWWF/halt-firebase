import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

import {
	deletePendingItem,
	getAgentToAgentTransactionTradeboardRefs,
	getUpdatedCurrentOrigins,
	getNewBuyerOriginsFromSellerPlantations,
	getNewBuyerOriginsFromSellerHoldings,
	getBuyerTradeboardCompletedUpdate,
	getSellerTradeboardCompletedUpdate,
	processErrorTransaction,
	getClientProfile,
	getContacts,
	validateSellerHoldings,
	updateTradeBoards
} from "./helpers"


const isPropValueChanged = (newData, previousData): boolean => {

	const { updatedAt, createdAt, ...restNewData } = newData
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}


/** edit/remove a super user*/
export default functions.region("asia-east2").firestore
	.document('transactionsPending/{transactionId}').onUpdate(async (change, context) => {
		console.log("**** Transaction Update ****")

		const previousData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;

		if (!isPropValueChanged(newData, previousData)) return

		await admin.firestore().runTransaction(async runner => {

			try {

				// result is null is accept is null
				const { buyerTradeboardUpdate, buyerTradeboardDocRef, sellerTradeboardCompletedUpdate } = await increaseBuyerAmountOnAccept(change, context, runner)
				const { sellerTradeboardUpdate, sellerTradeboardDocRef } = await decreaseSellerPendingAmount(change, runner)

				// update tradeboard, reduce the holdings pending amount and clear origin if holdings onhand hits zero
				if (sellerTradeboardDocRef && sellerTradeboardUpdate) {
					console.log("sellerTradeboardUpdate: ", sellerTradeboardUpdate)
					console.log("sellerTradeboardCompletedUpdate: ", sellerTradeboardCompletedUpdate)
					await runner.update(sellerTradeboardDocRef, { ...sellerTradeboardUpdate, ...sellerTradeboardCompletedUpdate })
				}

				// update tradeboard, and delete Pending doc if accept is not null
				if (buyerTradeboardDocRef && buyerTradeboardUpdate) {
					console.log("buyerTradeboardUpdate: ", buyerTradeboardUpdate)
					await runner.update(buyerTradeboardDocRef, buyerTradeboardUpdate)
					// delete the doc in Pending collection
					await runner.delete(change.after.ref)
					// delete the entry in tradeboard
					await deletePendingItem(runner, newData, change.after.id)
				}

				// upadate tradeboard on the changes in the rejected transaction
				await rejectTransaction(change, runner)

				return

			} catch (error) {
				console.error(error)
				return "Error: " + error;
			}

		})

	})


async function increaseBuyerAmountOnAccept(change, context, runner) {

	console.log("**** Increasing the Buyer Amount and Update Values ****")

	const newData = change.after.data() as FirebaseFirestore.DocumentData;
	const { state, origins, sellerId, buyerId, clientType, millId, amount } = newData
	if (state !== "accept") return { buyerTradeboardUpdate: null, buyerTradeboardDocRef: null, sellerTradeboardCompletedUpdate: null }
	/** Increase the buyer amount **/
	// if client Type is Agent and millId does not exist, this is agent to agent transaction
	const {
		isBuyerAgent,
		docOrigins,
		docOnhand,
		buyerTradeboardDocRef,
		buyerTradeboardDocData,
		sellerTradeboardDocData
	} = await getAgentToAgentTransactionTradeboardRefs(buyerId, sellerId, clientType, millId, runner)

	// total the  buyer on hand with accepted amount
	const currOnhand = isBuyerAgent ? buyerTradeboardDocData.agent.holdings.onhand : buyerTradeboardDocData.mill.holdings.onhand

	// total the  buyer on hand with accepted amount
	const buyerNewOnhand = amount + currOnhand

	// loop through buyer origins and calculate the new ratio
	const { updatedCurrentOrigins } = getUpdatedCurrentOrigins(isBuyerAgent, buyerTradeboardDocData, currOnhand, buyerNewOnhand)

	//loop through accepted transaction origins and create entry into tradeboard origins
	const { newBuyerOriginsFromSellerPlantations } = getNewBuyerOriginsFromSellerPlantations(context, origins, buyerNewOnhand)

	// loop through seller tradeboard origins, get the accepted transaction holdings amount and calc ratio, create entry into buyer tradeboard origins
	// seller is an Agent as there is not provision in app for mill to sell from holdings or plantation
	const { newBuyerOriginsFromSellerHoldings } = getNewBuyerOriginsFromSellerHoldings(context, sellerTradeboardDocData, origins, buyerNewOnhand)

	//create the buyer tradeboard update 
	const { buyerAgentCompleted, buyerMillCompleted } = getBuyerTradeboardCompletedUpdate(context, buyerTradeboardDocData)

	const buyerTradeboardUpdate = {
		[docOrigins]: [...updatedCurrentOrigins, ...newBuyerOriginsFromSellerPlantations, ...newBuyerOriginsFromSellerHoldings],
		[docOnhand]: buyerNewOnhand,
		...buyerAgentCompleted,
		...buyerMillCompleted
	}

	// create the seller tradeboard update
	const { sellerAgentCompleted, sellerMillCompleted } = getSellerTradeboardCompletedUpdate(context, sellerTradeboardDocData)

	const sellerTradeboardCompletedUpdate = {
		...sellerAgentCompleted,
		...sellerMillCompleted
	}

	return { buyerTradeboardUpdate, buyerTradeboardDocRef, sellerTradeboardCompletedUpdate }
}


async function decreaseSellerPendingAmount(change, runner) {
	console.log("**** Decreasing the Seller Pending and Update Values ****")

	const newData = change.after.data() as FirebaseFirestore.DocumentData;
	const { state, sellerId, origins } = newData
	if (state !== "accept") return { sellerTradeboardUpdate: null, sellerTradeboardDocRef: null }

	const sellerType = "agent" //Mill has no provision to sell

	// seller is an Agent as there is not provision in app for mill to sell from holdings or plantation
	const sellerTradeboardDocRef = admin.firestore().collection("tradeboard").doc(sellerId)
	const sellerTradeboardDocSnap = await runner.get(sellerTradeboardDocRef) as FirebaseFirestore.DocumentData;
	const sellerTradeboardDocData = sellerTradeboardDocSnap.data()

	const holdingsAmount = origins.holdings ? origins.holdings.amount : 0

	const sellerTradeboardUpdate = {
		[`${sellerType}.holdings.pending`]: sellerTradeboardDocData[sellerType].holdings.pending - holdingsAmount,
		[`${sellerType}.origins`]: sellerTradeboardDocData[sellerType].holdings.onhand === 0 ? [] : sellerTradeboardDocData[sellerType].origins
	}

	return { sellerTradeboardUpdate, sellerTradeboardDocRef }


}


// const rejectTransaction = (change, runner)=>{
async function rejectTransaction(change, runner) {

	console.log("**** Change of data ****")

	const snap = change.after
	const changedTransaction = snap.data() as FirebaseFirestore.DocumentData;
	const updatedAt = admin.firestore.Timestamp.fromMillis(Date.now())


	console.log("changedTransaction:  ", changedTransaction)
	const { state, changes, clientPhoneNumber, transactionType, origins, amount } = changedTransaction;

	if (state !== "change") return

	console.log("changes: ", changes)

	// identify client as seller or buyer based on transactionType
	const clientProfile = await getClientProfile(clientPhoneNumber, transactionType, runner)
	if (clientProfile.error) {
		const error = clientProfile.error.message
		await processErrorTransaction(changedTransaction, snap, updatedAt, error, runner)
		throw new Error
	}
	console.log("clientProfile: ", clientProfile)

	// get complete profile of buyer and seller. returns error if buyer id is hthe same as seller id
	const contactsProfile = getContacts(clientProfile, changedTransaction)
	if (contactsProfile.error) {
		const error = contactsProfile.error.message
		await processErrorTransaction(changedTransaction, snap, updatedAt, error, runner)
		throw new Error
	}
	console.log("contactsProfile: ", contactsProfile)

	// if the creator of runner is a seller check his holdings
	const validatedSellerHoldings = await validateSellerHoldings(origins, changedTransaction.sellerId, transactionType, runner)
	if (validatedSellerHoldings.error) {
		const error = validatedSellerHoldings.error.message
		await processErrorTransaction(changedTransaction, snap, updatedAt, error, runner)
		throw new Error
	}

	// new entry to the Tradeboard.pending map
	const pending = { [snap.id]: { ...contactsProfile, amount, updatedAt, transactionType, changes } }


	//update seller and buyer or mill tradeboards
	const updatedTradeboards = await updateTradeBoards(contactsProfile, runner, pending, origins.holdings)
	if (updatedTradeboards.error) {
		const error = updatedTradeboards.error.message
		await processErrorTransaction(changedTransaction, snap, updatedAt, error, runner)
		throw new Error
	}

	// create list of plantation origins in included in this transaction
	const plantationList = Object.keys(origins).filter(key => key !== "holdings")

	// update the Transaction doc
	await runner.update(snap.ref, { updatedAt, plantationList })

	return

}
