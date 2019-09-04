import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

/** create a new user document when a new firebase auth user is created */
export default functions.region("asia-east2").auth.user()
	.onCreate((user) => {
		return admin.firestore().doc('users/' + user.uid).set({
			vehicles : {},
			plantations : {},
			profile: {}
		});
	});
