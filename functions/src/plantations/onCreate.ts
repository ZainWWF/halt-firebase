import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import bqStreamInsert from "./bqStreamInsert"

/** add entry into user's plantation map when a plantation doc is created*/
export default functions.region("asia-east2").firestore
	.document('plantations/{plantationId}').onCreate(async (snap, context) => {

		try {

			const { userId, name, unAudited } = snap.data() as FirebaseFirestore.DocumentData;

			const plantationRef = 'plantations/' + context.params.plantationId
			const createdAt = admin.firestore.Timestamp.fromMillis(Date.now());
			const isActive = false;
			const auditAcceptedAt = null;
			const auditAt = null;
			const auditBy = null;
			const isRemoved = false;

			await admin.firestore().doc(plantationRef)
				.update({
					createdAt,
					isActive,
					auditAcceptedAt,
					auditAt,
					auditBy,
					isRemoved,
				})

			await admin.firestore().doc('users/' + userId).set({
				plantations: {
					[context.params.plantationId]: {
						ref: admin.firestore().doc(plantationRef),
						name,
						management: unAudited.management,
						auditAcceptedAt,
						isActive
					}
				}
			})

			bqStreamInsert({
				userId,
				name,
				createdAt,
				isActive,
				unAudited,
				auditAcceptedAt,
				auditAt,
				auditBy,
				isRemoved,
			})

			return;

		} catch (error) {

			return "Error: " + error;
		}

	})

