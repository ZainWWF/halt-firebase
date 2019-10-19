import * as admin from "firebase-admin"

// remove item from Tradeboard agent or mill pendings fields 
export async function deletePendingItem(runner: FirebaseFirestore.Transaction, docData: FirebaseFirestore.DocumentData, id: string) {

	const { buyerId, sellerId } = docData;

	try {

		console.log("removing from tradedboard transaction: ", id)
		if (buyerId) {
			console.log("buyer : ", buyerId)
			const sellerPendingDocRef = await admin.firestore().collection("tradeboard").doc(buyerId)
			await runner.update(sellerPendingDocRef, {
				[`agent.pending.${id}`]: admin.firestore.FieldValue.delete(),
				[`mill.pending.${id}`]: admin.firestore.FieldValue.delete()
			})
		}

		if (sellerId) {
			console.log("seller : ", sellerId)
			const buyerPendingDocRef = await admin.firestore().collection("tradeboard").doc(sellerId)
			await runner.update(buyerPendingDocRef, {
				[`agent.pending.${id}`]: admin.firestore.FieldValue.delete(),
				[`mill.pending.${id}`]: admin.firestore.FieldValue.delete()
			})
		}

	} catch (error) {
		console.error(error)

		return

	}

	return

}

// identify the agents that is the buyer or seller and the paths in Tradeboard collection to update
export async function getAgentToAgentTransactionTradeboardRefs(buyerId, sellerId, clientType, millId, runner) {

	// if client Type is Agent and millId does not exist, this is agent to agent transaction
	const isBuyerAgent = clientType === "Agent" && !millId
	const docOrigins = isBuyerAgent ? "agent.origins" : "mill.origins"
	const docOnhand = isBuyerAgent ? "agent.holdings.onhand" : "mill.holdings.onhand"

	//get the holdings of the buyer
	const buyerTradeboardDocRef = admin.firestore().collection("tradeboard").doc(buyerId)
	const buyerTradeboardDocSnap = await runner.get(buyerTradeboardDocRef) as FirebaseFirestore.DocumentData;
	const buyerTradeboardDocData = buyerTradeboardDocSnap.data()

	// seller is an Agent as there is not provision in app for mill to sell from holdings or plantation
	const sellerTradeboardDocRef = admin.firestore().collection("tradeboard").doc(sellerId)
	const sellerTradeboardDocSnap = await runner.get(sellerTradeboardDocRef) as FirebaseFirestore.DocumentData;
	const sellerTradeboardDocData = sellerTradeboardDocSnap.data()

	return {
		isBuyerAgent,
		docOrigins,
		docOnhand,
		buyerTradeboardDocRef,
		buyerTradeboardDocData,
		sellerTradeboardDocRef,
		sellerTradeboardDocData
	}
}

// loop through buyer origins and calculate the new ratio
export function getUpdatedCurrentOrigins(isBuyerAgent, buyerTradeboardDocData, currOnhand, buyerNewOnhand) {

	const currentOrigins = isBuyerAgent ? buyerTradeboardDocData.agent.origins : buyerTradeboardDocData.mill.origins
	console.log("currentOrigins: ", currentOrigins)

	const updatedCurrentOrigins = !currentOrigins ? [] : currentOrigins.map(origin => {
		const idList = Object.keys(origin)
		if (idList.length === 0) return {}

		const [newOrigin] = idList.map(id => {
			if (id.length === 0) return {};
			const ratio = (origin[id].ratio * currOnhand) / buyerNewOnhand
			const transactionIds = origin[id].transactionIds
			return { [id]: { transactionIds, ratio } }
		})
		return newOrigin
	})
	console.log("updatedCurrentOrigins: ", updatedCurrentOrigins)

	return { updatedCurrentOrigins, currOnhand }
}

//loop through accepted transaction origins and create entry into tradeboard origins
export function getNewBuyerOriginsFromSellerPlantations(context, origins, buyerNewOnhand) {

	const sellerPlantations = !origins ? [] : Object.keys(origins).filter(id => id !== "holdings");
	const newBuyerOriginsFromSellerPlantations = sellerPlantations.map(id => {
		const ratio = origins[id].amount / buyerNewOnhand
		const transactionIds = [`${context.params.transactionId}`]
		return { [id]: { transactionIds, ratio } }
	})
	console.log("newBuyerOriginsFromSellerPlantations: ", newBuyerOriginsFromSellerPlantations)

	return { newBuyerOriginsFromSellerPlantations }

}

// loop through seller tradeboard origins, get the accepted transaction holdings amount and calc ratio, create entry into buyer tradeboard origins
// seller is an Agent as there is not provision in app for mill to sell from holdings or plantation
export function getNewBuyerOriginsFromSellerHoldings(context, sellerTradeboardDocData, origins, buyerNewOnhand) {

	console.log("sellerTradeboardDocData.agent.origins: ", sellerTradeboardDocData.agent.origins)
	console.log("origins.holdings: ", origins.holdings)
	const newBuyerOriginsFromSellerHoldings = !sellerTradeboardDocData.agent.origins || !origins.holdings ? [] : sellerTradeboardDocData.agent.origins.map((origin: any) => {
		const [newOrigin] = Object.keys(origin).map(id => {
			const ratio = (origin[id].ratio * origins.holdings.amount) / buyerNewOnhand
			const transactionIds = [...origin[id].transactionIds, `${context.params.transactionId}`]
			return { [id]: { transactionIds, ratio } }
		})
		return newOrigin
	})
	console.log("newBuyerOriginsFromSellerHoldings: ", newBuyerOriginsFromSellerHoldings)

	return { newBuyerOriginsFromSellerHoldings }

}

//create the buyer tradeboard update 
export function getBuyerTradeboardCompletedUpdate(context, buyerTradeboardDocData) {

	const buyerAgentPendingTransactionDoc = buyerTradeboardDocData.agent.pending[context.params.transactionId]
	const buyerMillPendingTransactionDoc = buyerTradeboardDocData.mill.pending[context.params.transactionId]

	const buyerAgentCompletedTransactionId = `agent.completed.${context.params.transactionId}`
	const buyerMillCompletedTransactionId = `mill.completed.${context.params.transactionId}`

	const buyerAgentCompleted = buyerAgentPendingTransactionDoc ? { [buyerAgentCompletedTransactionId]: buyerAgentPendingTransactionDoc } : {}
	const buyerMillCompleted = buyerMillPendingTransactionDoc ? { [buyerMillCompletedTransactionId]: buyerMillPendingTransactionDoc } : {}

	return { buyerAgentCompleted, buyerMillCompleted }

}

// create the seller tradeboard update
export function getSellerTradeboardCompletedUpdate(context, sellerTradeboardDocData) {

	const sellerAgentPendingTransactionDoc = sellerTradeboardDocData.agent.pending[context.params.transactionId]
	const sellerMillPendingTransactionDoc = sellerTradeboardDocData.mill.pending[context.params.transactionId]

	const sellerAgentCompletedTransactionId = `agent.completed.${context.params.transactionId}`
	const sellerMillCompletedTransactionId = `mill.completed.${context.params.transactionId}`

	const sellerAgentCompleted = sellerAgentPendingTransactionDoc ? { [sellerAgentCompletedTransactionId]: sellerAgentPendingTransactionDoc } : {}
	const sellerMillCompleted = sellerMillPendingTransactionDoc ? { [sellerMillCompletedTransactionId]: sellerMillPendingTransactionDoc } : {}

	return { sellerAgentCompleted, sellerMillCompleted }
}

// get the buyer and seller details
export async function getClientProfile(clientPhoneNumber: string, transactionType: string, runner: FirebaseFirestore.Transaction) {

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

// identify the buyer and selller in ther transaction. buyer and seller cannot be the same
export function getContacts(clientProfile, newTransaction) {

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
				transactionType,
				clientType
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
			transactionType,
			clientType

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

// validate that seller has sufficient in holdings to sell
export async function validateSellerHoldings(origins: Record<string, any>, seller: string, transactionType: string, runner: FirebaseFirestore.Transaction) {

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
		// TODO: same check if seller is a Mill

		console.log("origins.holdings.amount: ", origins.holdings.amount)
		console.log("tradeboardSnapDoc!.agent.holdings.onhand: ", tradeboardSnapDoc!.agent.holdings.onhand)
		if (tradeboardSnapDoc!.agent.holdings.onhand < origins.holdings.amount || tradeboardSnapDoc!.agent.holdings.onhand === 0) {
			throw new Error("insufficent holdings on hand for the sell amount")
		}

		return { tradeboard: tradeboardSnapDoc }

	} catch (error) {
		return { error }
	}
}

// update the tradeboards of buyer and seller of the succesfully created transaction
export async function updateTradeBoards(contactsProfile: any, runner: FirebaseFirestore.Transaction, newPending, originsHoldings) {

	const holdingsAmount = originsHoldings ? originsHoldings.amount : 0

	try {

		const sellerDocRef = admin.firestore().collection("tradeboard").doc(contactsProfile.sellerId)
		const sellerDocSnap = await runner.get(sellerDocRef)

		const buyerDocRef = admin.firestore().collection("tradeboard").doc(contactsProfile.buyerId)
		const buyerDocSnap = await runner.get(buyerDocRef)

		// agents buys and sell to each other
		if (!contactsProfile.millId) {
			console.log("agent to agent transaction update")
			const sellerPending = sellerDocSnap.data()!.agent.pending
			const buyerPending = buyerDocSnap.data()!.agent.pending
			const sellerHoldingsOnhand = sellerDocSnap.data()!.agent.holdings.onhand
			const sellerHoldingsPending = sellerDocSnap.data()!.agent.holdings.pending

			await runner.update(sellerDocRef,
				{
					"agent.pending": { ...sellerPending, ...newPending },
					"agent.holdings.pending": sellerHoldingsPending + holdingsAmount,
					"agent.holdings.onhand": sellerHoldingsOnhand - holdingsAmount
				}
			)

			await runner.update(buyerDocRef, { "agent.pending": { ...buyerPending, ...newPending } })

			console.log("sellerPending: ", sellerPending)
			console.log("buyerPending: ", buyerPending)
		}

		// transaction scenario - mill buys from agent or agent sells to mill
		if (((contactsProfile.clientType === "Agent" && contactsProfile.transactionType === "Buy")
			|| (contactsProfile.clientType === "Mill" && contactsProfile.transactionType === "Sell"))
			&& contactsProfile.millId) {
			console.log("agent to mill transaction update")
			const sellerPending = sellerDocSnap.data()!.agent.pending
			const buyerPending = buyerDocSnap.data()!.mill.pending
			const sellerHoldingsOnhand = sellerDocSnap.data()!.agent.holdings.onhand
			const sellerHoldingsPending = sellerDocSnap.data()!.agent.holdings.pending

			await runner.update(sellerDocRef,
				{
					"agent.pending": { ...sellerPending, ...newPending },
					"agent.holdings.pending": sellerHoldingsPending + holdingsAmount,
					"agent.holdings.onhand": sellerHoldingsOnhand - holdingsAmount
				}
			)

			await runner.update(buyerDocRef, { "mill.pending": { ...buyerPending, ...newPending } })

			console.log("sellerPending: ", sellerPending)
			console.log("buyerPending: ", buyerPending)
		}


		// transaction scenario -  mill sells to agent - not allow
		if (contactsProfile.clientType === "Agent" && contactsProfile.transactionType === "Sell" && contactsProfile.millId) {
			console.log("mill sells to agent transaction!! not allowed")
			throw new Error()
		}

		console.log("newPending: ", newPending)


	} catch (error) {

		return { error }
	}

	return {}
}

// update the tradeboard of the originator of the transaction  with error detail
export async function processErrorTransaction(newTransaction: FirebaseFirestore.DocumentData, snap: FirebaseFirestore.DocumentSnapshot, createdAt: FirebaseFirestore.Timestamp, error: any, runner: FirebaseFirestore.Transaction) {

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
