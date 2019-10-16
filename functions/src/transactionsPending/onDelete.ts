import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import deletePendingItem from "./deletePendingItem"

/** delete pending transaction*/
export default functions.region("asia-east2").firestore
	.document('/transactionsPending/{transactionsId}').onDelete(async (snap, context) => {

		await admin.firestore().runTransaction(async runner => {

			try {

				const docData = snap.data() as FirebaseFirestore.DocumentData
				await deletePendingItem(runner, docData, snap.id)

				const transactionCancelledDocRef = admin.firestore().collection("transactionsCancelled").doc()
				await runner.set(transactionCancelledDocRef, {
					...docData,
					cancelledAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

				return

			} catch (error) {
				console.error(error)
				return "Error: " + error;
			}

		})

	})

