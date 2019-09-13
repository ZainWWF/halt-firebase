import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** update user's plantation map entry when the plantation document is updated */
export default functions.region("asia-east2").firestore
	.document('plantations/{plantationId}').onUpdate(async (change, context) => {

		try {

			const newPlantationData = change.after.data() as FirebaseFirestore.DocumentData;
			const plantationRef = 'plantations/' + context.params.plantationId
	
			await admin.firestore().doc(plantationRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			await admin.firestore().doc('users/' + newPlantationData.userId).set({
				plantations: {
					[context.params.plantationId]: {
						ref: admin.firestore().doc(plantationRef),
						name: newPlantationData.name,
						owner: newPlantationData.owner,
						management : newPlantationData.management,
						isAudited: newPlantationData.isAudited,
						isActive: newPlantationData.isActive
					}
				}
			}, { merge: true })


			return

		} catch (error) {

			return "Error: " + error;

		}

	});

