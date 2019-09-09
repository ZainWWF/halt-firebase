import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add entry into user's plantation map when a plantation doc is created*/
export default functions.firestore
	.document('plantations/{plantationId}').onCreate(async (snap, context) => {

		try {

			const { userId, name, management, owner } = snap.data() as FirebaseFirestore.DocumentData;

			const plantationRef = 'plantations/' + context.params.plantationId

			await admin.firestore().doc(plantationRef)
				.update({
					createdAt: admin.firestore.Timestamp.fromMillis(Date.now()),
					isActive: false
				})

			await admin.firestore().doc('users/' + userId).set({
				plantations: {
					[context.params.plantationId]: {
						ref: admin.firestore().doc(plantationRef),
						name,
						owner,
						management,
						isAudited: false,
						isActive: false

					}
				}
			}, { merge: true })

			return;

		} catch (error) {

			return "Error: " + error;
		}

	})
