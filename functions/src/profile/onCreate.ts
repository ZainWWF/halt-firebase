import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add entry into user's vehicle map when a vehicle doc is created*/
export default functions.region("asia-east2").firestore
	.document('profile/{userId}').onCreate(async(snap, context) => {

		const userId = context.params.userId;
		const newProfile = snap.data() as FirebaseFirestore.DocumentData;
		const profileRef = `profiles/${userId}`
		
		await admin.firestore().doc(profileRef).update({
			createdAt: admin.firestore.Timestamp.fromMillis(Date.now())
		})

		return await admin.firestore().doc(`users/${userId}`).set({
						profile: {
							name : newProfile.name,
							photoUrl : newProfile.photoUrl
						}
					}, { merge: true })

	})