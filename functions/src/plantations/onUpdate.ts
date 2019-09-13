import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}

/** update user's plantation map entry when the plantation document is updated */
export default functions.region("asia-east2").firestore
	.document('plantations/{plantationId}').onUpdate(async (change, context) => {
		const previousData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;

		// do not check for changes in timestamp fields
		const { updatedAt, createdAt, auditAcceptedAt, ...restNewData } = newData
		const plantationRef = 'plantations/' + context.params.plantationId

		try {
			// check for changes in the Vehicle fields
			// if no change found, do not proceed
			if (!isPropValueChanged(restNewData, previousData)) return null

			await admin.firestore()
				.doc(plantationRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})


			// refresh User.plantation map with unremoved Vehicle docs for the userID
			const plantationsSnapshot = await admin.firestore().collection("plantations")
				.where("userId", "==", previousData.userId)
				.where("isRemoved", "==", false).get()

			const plantationsMap = plantationsSnapshot.docs.reduce((acc, plantation) => {
				return {
					...acc,
					[plantation.id]: {
						ref: plantation.ref,
						name: plantation.data().name,
						management: plantation.data().unAudited.management,
						auditAcceptedAt: plantation.data().auditAcceptedAt,
						isActive: plantation.data().isActive,
					}
				}
			}, {})


			await admin.firestore().doc(`users/${previousData.userId}`).set({ plantations: plantationsMap }, { mergeFields: ["plantations"] })
			return

		} catch (error) {
			console.log(error)
			return "Error: " + error;

		}

	});

