import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import {
	processErrorTransaction,
	getClientProfile,
	getContacts,
	validateSellerHoldings,
	updateTradeBoards
} from "./helpers"


/** new transaction*/
export default functions.region("asia-east2").firestore
	.document('transactionsPending/{transactionsId}').onCreate(async (snap, context) => {

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
				const pending = { [snap.id]: { ...contactsProfile, amount, createdAt, transactionType } }


				//update seller and buyer or mill tradeboards
				const updatedTradeboards = await updateTradeBoards(contactsProfile, runner, pending, origins.holdings)
				if (updatedTradeboards.error) {
					const error = updatedTradeboards.error.message
					await processErrorTransaction(newTransaction, snap, createdAt, error, runner)
					throw new Error
				}

				// create list of plantation origins in included in this transaction
				const plantationList = Object.keys(origins).filter(key => key !== "holdings")

				// update the Transaction doc
				const collectionPoint = newTransaction.collectionPointIsProvided ? newTransaction.collectionPoint : null;
				await runner.update(snap.ref, { ...newTransaction, ...contactsProfile, createdAt, collectionPoint, status: "Pending", plantationList })

				return

			} catch (error) {
				console.error(error)
			}

			return
		});
	})

