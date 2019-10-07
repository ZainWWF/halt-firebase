import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** new super user*/
export default functions.region("asia-east2").firestore
	.document('superUser/{superUserId}').onCreate(async (snap, context) => {

		try {

			const { phoneNumber } = snap.data() as FirebaseFirestore.DocumentData;

			if (!phoneNumber) {
				await snap.ref.delete()
			}

			console.log("creating superUser: ", phoneNumber)

			let user;

			try {
				// check if number is in firebaseAuth
				user = await admin.auth().getUserByPhoneNumber(phoneNumber)

			} catch (error) {
	
				console.log(error)
				// create new user
				user = await admin.auth().createUser({ phoneNumber })
			
			}

			// check if phoneNumber is already in database
			const duplicateUser = await admin.firestore().collection("superUser")
				.where("phoneNumber", "==", phoneNumber)
				.get()

			// there is more than 1 doc with this phoneNumber
			if (duplicateUser.size > 1) {
				await Promise.all(duplicateUser.docs.map(async doc => {
					if (Boolean(doc.data().createdAt))  {
						await doc.ref.delete()
					}
				}))
			}

			// set superUser role to user
			await admin.auth().setCustomUserClaims(user.uid, { superUser: true })

			// if not in database, add the createdAt
			await snap.ref.update({
				createdAt: admin.firestore.Timestamp.fromMillis(Date.now()),
			})

			return;

		} catch (error) {
			console.error(error)

			return "Error: " + error;
		}

	})

