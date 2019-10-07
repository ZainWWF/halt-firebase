import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** delete super user*/
export default functions.region("asia-east2").firestore
	.document('superUser/{superUserId}').onDelete(async (snap, context) => {

		try {

			console.log("deleting superUser: ", snap.data())
			const { phoneNumber } = snap.data() as FirebaseFirestore.DocumentData;

			if (!phoneNumber)  return;

			const	user = await admin.auth().getUserByPhoneNumber(phoneNumber)

			// set superUser role to user
			await admin.auth().setCustomUserClaims(user.uid, { superUser: false })

			return;

		} catch (error) {
			console.error(error)
			return "Error: " + error;
		}

	})

