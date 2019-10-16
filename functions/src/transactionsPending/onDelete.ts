import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** delete pending transaction*/
export default functions.region("asia-east2").firestore
	.document('/transactionsPending/{transactionsId}').onDelete(async (snap, context) => {

		await admin.firestore().runTransaction(async runner => {

			try {

				const { buyerId, sellerId } = snap.data() as FirebaseFirestore.DocumentData;

				const sellerPendingDocRef = await admin.firestore().collection("tradeboard").doc(buyerId)
				await runner.update(sellerPendingDocRef, {
					[`agent.pending.${snap.id}`]: admin.firestore.FieldValue.delete(),
					[`mill.pending.${snap.id}`]: admin.firestore.FieldValue.delete()
				})

				const buyerPendingDocRef = await admin.firestore().collection("tradeboard").doc(sellerId)
				await runner.update(buyerPendingDocRef, {
					[`agent.pending.${snap.id}`]: admin.firestore.FieldValue.delete(),
					[`mill.pending.${snap.id}`]: admin.firestore.FieldValue.delete()
				})

				const transactionCancelledDocRef = admin.firestore().collection("transactionsCancelled").doc()
				await runner.set(transactionCancelledDocRef, {
					...snap.data(),
					cancelledAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

				return

			} catch (error) {
				console.error(error)
				return "Error: " + error;
			}

		})

	})

