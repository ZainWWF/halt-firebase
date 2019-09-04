import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** update User.vehicle map entry when the vehicle document is updated */
export default functions.region("asia-east2").firestore
	.document('profiles/{userId}').onUpdate(async (change, context) => {

		try {

			const updatedProfileData = change.after.data() as FirebaseFirestore.DocumentData;;

			const profileRef = 'profiles/' + context.params.userId
			await admin.firestore().
				doc(profileRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			await admin.firestore().doc('users/' + context.params.userId).set({
				profile: {
					name: updatedProfileData.name,
					photoUrl: updatedProfileData.photoUrl
				}
			}, { merge: true })

			return

		} catch (error) {

			return error

		}

	});
