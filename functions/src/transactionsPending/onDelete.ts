import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import { 
	deletePendingItem,
} from "./helpers"

/** delete pending transaction*/
export default functions.region("asia-east2").firestore
	.document('transactionsPending/{transactionId}').onDelete(async (snap, context) => {
		console.log("**** Transaction Delete ****")
		const docData = snap.data() as FirebaseFirestore.DocumentData

		const { state } = docData

		await admin.firestore().runTransaction(async runner => {

			try {


				if (state === "accept") {
					const transactionCompletedDocRef = admin.firestore().collection("transactionsCompleted").doc(snap.id)
					await runner.set(transactionCompletedDocRef, {
						...docData,
						status: "Completed", 
						acceptedAt: admin.firestore.Timestamp.fromMillis(Date.now())
					})

					return
				}

				const transactionCancelledDocRef = admin.firestore().collection("transactionsCancelled").doc(snap.id)
				await runner.set(transactionCancelledDocRef, {
					...docData,
					cancelledAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

				await deletePendingItem(runner, docData, snap.id)

				return

			} catch (error) {
				console.error(error)
				return "Error: " + error;
			}

		})

	})

