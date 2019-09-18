import * as admin from "firebase-admin"

export default async function (userId) {

	// refresh User.profile map with Profile docs for the userID
	const authUser = await admin.auth().getUser(userId)
	const userProfileSnap = await admin.firestore().doc(`profiles/${userId}`).get()
	const userProfile = userProfileSnap.data();

	return {
		phoneNumber: authUser.phoneNumber,
		name: userProfile && userProfile.name ? userProfile.name : null,
		photoUrl: userProfile && userProfile.photoUrl ? userProfile.photoUrl : null
	}

}