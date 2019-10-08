import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** new mill admin user*/
export default functions.region("asia-east2").firestore
	.document('mills/{millId}/millAdmins/{millAdminId}').onCreate(async (snap, context) => {

		try {

			const { phoneNumber, createdAt, name } = snap.data() as FirebaseFirestore.DocumentData;

			// if this doc has a createdAt field, it means its doc id has been changed to the userId
			// so don't continue.
			if (createdAt) return
			console.log("creating millAdmin: ", phoneNumber)

			let user;

			try {
				// check if number is in firebaseAuth
				user = await admin.auth().getUserByPhoneNumber(phoneNumber)
				console.log("user already exist!")
			} catch (error) {

				console.log("create new user")
				// create new user
				user = await admin.auth().createUser({ phoneNumber })
				await admin.firestore().collection("profiles").doc(user.uid).set({ name, phoneNumber  })
			}

			// create new doc with user id as the doc id
			console.log("creating: ", user.uid)
			await snap.ref.parent.doc(user.uid).set({
				...snap.data(),
				createdAt: admin.firestore.Timestamp.fromMillis(Date.now()),
				name
			})

			// delete the old doc
			console.log("deleting: ", snap.ref.path)
			await snap.ref.delete();

			return;

		} catch (error) {
			console.error(error)
			await snap.ref.delete();
			return "Error: " + error;
		}

	})

