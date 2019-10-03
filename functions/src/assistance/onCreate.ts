import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add entry into user's assistance map when a assistance doc is created*/
export default functions.region("asia-east2").firestore
	.document('assistances/{assistanceId}').onCreate(async (snap, context) => {

		try {

			const assistanceRef = 'assistances/' + context.params.assistanceId

			await admin.firestore().doc(assistanceRef)
				.update({
					createdAt: admin.firestore.Timestamp.fromMillis(Date.now()),
					isResolved: false
				})

			return

		} catch (error) {

			return "Error: " + error
		}


	})