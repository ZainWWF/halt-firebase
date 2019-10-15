import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"


/** new transaction*/
export default functions.region("asia-east2").firestore
	.document('/transactionsPending/{transactionsId}').onCreate(async (snap, context) => {

		console.log("**** New Transaction *****")

		const createdAt = admin.firestore.Timestamp.fromMillis(Date.now())
		const newTransaction = snap.data() as FirebaseFirestore.DocumentData;

		const { clientPhoneNumber, transactionType, origins, clientType, millId, amount } = newTransaction;

		await admin.firestore().runTransaction(async runner => {
			try {

				console.log("transactionType: ", transactionType)

				// requires mill Id if client is a Mill
				if (clientType === "Mill" && !millId) {
					const error = "millId required";
					await processErrorTransaction(newTransaction, snap, createdAt, error, runner)
					throw new Error
				}

				// identify client as seller or buyer based on transactionType
				const clientProfile = await getClientProfile(clientPhoneNumber, transactionType, runner)
				if (clientProfile.error) {
					const error = clientProfile.error.message
					await processErrorTransaction(newTransaction, snap, createdAt, error, runner)
					throw new Error
				}
				console.log("clientProfile: ", clientProfile)

				// get complete profile of buyer and seller. returns error if buyer id is hthe same as seller id
				const contactsProfile = getContacts(clientProfile, newTransaction)
				if (contactsProfile.error) {
					const error = contactsProfile.error.message
					await processErrorTransaction(newTransaction, snap, createdAt, error, runner)
					throw new Error
				}
				console.log("contactsProfile: ", contactsProfile)


				// if the creator of runner is a seller check his holdings
				const validatedSellerHoldings = await validateSellerHoldings(origins, newTransaction.sellerId, transactionType, runner)
				if (validatedSellerHoldings.error) {
					const error = validatedSellerHoldings.error.message
					await processErrorTransaction(newTransaction, snap, createdAt, error, runner)
					throw new Error
				}

				// new entry to the Tradeboard.pending map
				const pending = { [snap.id]: { ...contactsProfile, amount, createdAt } }

				//update seller and buyer or mill tradeboards
				const updatedTradeboards = await updateTradeBoards(contactsProfile, runner, pending)
				if (updatedTradeboards.error) {
					const error = updatedTradeboards.error.message
					await processErrorTransaction(newTransaction, snap, createdAt, error, runner)
					throw new Error
				}


				// update the Transaction doc
				const collectionPoint = newTransaction.collectionPointIsProvided ? newTransaction.collectionPoint : null;
				await runner.update(snap.ref, { ...newTransaction, ...contactsProfile, createdAt, collectionPoint, status: "Pending" })

				return

			} catch (error) {
				console.error(error)
			}

			return
		});
	})


// get the buyer and seller details
async function getClientProfile(clientPhoneNumber: string, transactionType: string, runner: FirebaseFirestore.Transaction) {

	try {

		console.log("searching client: ", clientPhoneNumber)
		const user = await admin.auth().getUserByPhoneNumber(clientPhoneNumber)
		console.log(`client ${user.uid} found in auth database!`)

		// get existing name from profile
		const clientDocRef = admin.firestore().collection("users").doc(user.uid)
		const existingUserSnap = await runner.get(clientDocRef)

		const existingName = () => {
			if (existingUserSnap.exists && existingUserSnap.data()!.profile) {
				return existingUserSnap.data()!.profile.name
			}
			return null
		}

		if (transactionType === "Buy") {
			return { sellerId: user.uid, sellerName: existingName() }
		}
		// if transactionType === "Sell"
		return { buyerId: user.uid, buyerName: existingName() }


	} catch (error) {
		return { error }
	}

}

// valdate that seller has sufficient in holdings to sell
async function validateSellerHoldings(origins: Record<string, any>, seller: string, transactionType: string, runner: FirebaseFirestore.Transaction) {

	//on creation, 
	// 1. only check against the Seller holdings
	// 2. if this is Buy, the owner is not the seller, no need validate owner's holding
	if (transactionType === "Buy") {
		return {}
	}
	try {
		console.log("origins of sources: ", origins)

		// check for any duplicates in origins
		const entries = Object.keys(origins)
		const uniqueEntries = new Set(entries)
		if (entries.length > uniqueEntries.size) {
			throw new Error("no duplicate origins allowed")
		}

		//  if origin has none from holdings, return
		if (!entries.includes("holdings")) return {}
		// get the seller tradeboard data
		const tradeboardDocRef = admin.firestore().collection("tradeboard").doc(seller)
		const tradeboardSnap = await runner.get(tradeboardDocRef)
		const tradeboardSnapDoc = tradeboardSnap.data()

		// check if seller's holding amount in the source is more than allowed
		if (tradeboardSnapDoc!.holdings.onhand < origins.holdings.amount || tradeboardSnapDoc!.holdings.onhand === 0) {
			throw new Error("insufficent holdings on hand for the sell amount")
		}

		return { tradeboard: tradeboardSnapDoc }

	} catch (error) {
		return { error }
	}
}

// identify the buyer and selller in ther transaction. buyer and seller cannot be the same
function getContacts(clientProfile, newTransaction) {

	const { millId, millName, sellerId, sellerName, buyerId, buyerName, transactionType, clientType } = newTransaction

	const processContacts = () => {
		if (transactionType === "Sell") {

			return {
				millId: clientType === "Mill" ? millId : null,
				millName: clientType === "Mill" ? millName : null,
				createdBy: sellerId,
				sellerId: sellerId,
				sellerName: sellerName,
				buyerId: clientProfile["buyerId"],
				buyerName: clientProfile["buyerName"],
			}
		}
		// if transactionType === "Buy"
		return {
			millId: clientType === "Mill" ? millId : null,
			millName: clientType === "Mill" ? millName : null,
			createdBy: buyerId,
			sellerId: clientProfile["sellerId"],
			sellerName: clientProfile["sellerName"],
			buyerId: buyerId,
			buyerName: buyerName,

		}
	}


	try {

		const contacts = processContacts()

		if (Object.values(contacts).includes(null || undefined)) {
			throw new Error("contact cannot be null or undefined")
		}

		if (contacts.sellerId === contacts.buyerId) {
			throw new Error("buyer and seller cannot be the same");
		}

		return { ...contacts }

	} catch (error) {
		return { error }
	}

}

// update the tradeboards of buyer and seller of the succesfully created transaction
async function updateTradeBoards(contactsProfile: any, runner: FirebaseFirestore.Transaction, newPending) {

	try {

		const sellerDocRef = admin.firestore().collection("tradeboard").doc(contactsProfile.sellerId)
		const sellerDocSnap = await runner.get(sellerDocRef)


		const buyerDocRef = admin.firestore().collection("tradeboard").doc(contactsProfile.buyerId)
		const buyerDocSnap = await runner.get(buyerDocRef)

		// agents buys and sell
		if (!contactsProfile.millId) {
			console.log("agent to agent transaction update")
			const sellerPending = sellerDocSnap.data()!.agent.pending as FirebaseFirestore.DocumentData
			const buyerPending = buyerDocSnap.data()!.agent.pending as FirebaseFirestore.DocumentData
			await runner.update(sellerDocRef, { "agent.pending": { ...sellerPending, ...newPending } })
			await runner.update(buyerDocRef, { "agent.pending": { ...buyerPending, ...newPending } })
			console.log("sellerPending: ", sellerPending)
			console.log("buyerPending: ", buyerPending)
		}

		// seller specified a mill in the transaction, so buyer is a mill rep
		if (contactsProfile.createdBy === contactsProfile.sellerId &&  contactsProfile.millId) {
			console.log("agent to mill transaction update")
			const sellerPending = sellerDocSnap.data()!.agent.pending as FirebaseFirestore.DocumentData
			const buyerPending = buyerDocSnap.data()!.mill.pending as FirebaseFirestore.DocumentData
			await runner.update(sellerDocRef, { "agent.pending": { ...sellerPending, ...newPending } })
			await runner.update(buyerDocRef, { "mill.pending": { ...buyerPending, ...newPending } })
			console.log("sellerPending: ", sellerPending)
			console.log("buyerPending: ", buyerPending)
		}

		// buyer specified a mill in the transaction, so seller is a mill rep ** this MAY not be allowed ***
		if (contactsProfile.createdBy === contactsProfile.buyerId && contactsProfile.millId ) {
			console.log("mill to agent transaction update")
			const sellerPending = sellerDocSnap.data()!.mill.pending as FirebaseFirestore.DocumentData
			const buyerPending = buyerDocSnap.data()!.agent.pending as FirebaseFirestore.DocumentData
			await runner.update(sellerDocRef, { "mill.pending": { ...sellerPending, ...newPending } })
			await runner.update(buyerDocRef, { "agent.pending": { ...buyerPending, ...newPending } })
			console.log("sellerPending: ", sellerPending)
			console.log("buyerPending: ", buyerPending)
		}

		console.log("newPending: ", newPending)


	} catch (error) {

		return { error }
	}

	return {}
}

// update the tradeboard of the originator of the transaction  with error detail
async function processErrorTransaction(newTransaction: FirebaseFirestore.DocumentData, snap: FirebaseFirestore.DocumentSnapshot, createdAt: FirebaseFirestore.Timestamp, error: any, runner: FirebaseFirestore.Transaction) {

	const { buyerId, buyerName, sellerId, sellerName, amount, transactionType, millId } = newTransaction
	const ownerContact = transactionType === "Buy" ? { createdBy: buyerId, buyerId, buyerName } : { createdBy: sellerId, sellerId, sellerName }

	const userTradeBoardRef = admin.firestore().collection("tradeboard").doc(ownerContact.createdBy)
	const userTradeBoardSnap = await runner.get(userTradeBoardRef)
	const userTradeBoard = userTradeBoardSnap.data()
	console.log(`${ownerContact.createdBy} TradeBoard: `, userTradeBoard)


	const errorPending = { [snap.id]: { ...ownerContact, amount, createdAt, error }, }

	if (ownerContact.createdBy === millId) {
		console.log("updating error to mill: ", millId)
		await runner.update(userTradeBoardSnap.ref, { "mill.pending": { ...errorPending, ...userTradeBoard!.mill.pending } })
	} else {
		await runner.update(userTradeBoardSnap.ref, { "agent.pending": { ...errorPending, ...userTradeBoard!.agent.pending } })
	}

	console.log("transaction with error: ", errorPending)

	await runner.update(snap.ref, { createdAt, status: error })

	return

}