import * as admin from "firebase-admin"

export default async function (runner: FirebaseFirestore.Transaction, docData: FirebaseFirestore.DocumentData, id: string) {

	const { buyerId, sellerId } = docData;

	const sellerPendingDocRef = await admin.firestore().collection("tradeboard").doc(buyerId)
	await runner.update(sellerPendingDocRef, {
		[`agent.pending.${id}`]: admin.firestore.FieldValue.delete(),
		[`mill.pending.${id}`]: admin.firestore.FieldValue.delete()
	})

	const buyerPendingDocRef = await admin.firestore().collection("tradeboard").doc(sellerId)
	await runner.update(buyerPendingDocRef, {
		[`agent.pending.${id}`]: admin.firestore.FieldValue.delete(),
		[`mill.pending.${id}`]: admin.firestore.FieldValue.delete()
	})

	return

}