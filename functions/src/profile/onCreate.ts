import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add entry into user's vehicle map when a vehicle doc is created*/
export default functions.region("asia-east2").firestore
	.document('profiles/{userId}').onCreate(async (snap, context) => {

		try {
			const userId = context.params.userId;
			const newProfile = snap.data() as FirebaseFirestore.DocumentData;
			const profileRef = `profiles/${userId}`

			await admin.firestore().doc(profileRef).update({
				createdAt: admin.firestore.Timestamp.fromMillis(Date.now())
			})

			await admin.firestore().doc(`users/${userId}`).update({
				profile: {
					name: newProfile.name,
					photoUrl: newProfile.photoUrl ? newProfile.photoUrl : null
				}
			})

			return

		} catch (error) {
			console.error(error)
			return "Error: " + error

		}


	})