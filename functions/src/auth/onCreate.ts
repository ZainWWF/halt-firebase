import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

/** create a new user document when a new firebase auth user is created */
export default functions.region("asia-east2").auth.user()
	.onCreate(async (user) => {

		await admin.firestore().doc('users/' + user.uid).set({
			vehicles: {},
			plantations: {},
			profile: {
				name: "",
				phoneNumber: user.phoneNumber
			},
			mills: {}
		});

		await admin.firestore().doc('tradeboard/' + user.uid).set({
	
			agent: {
				holdings: { onhand: 0, pending: 0 },
				pending: {},
				completed: {},
				rejected: {},
			},
			mill: {
				holdings: { onhand: 0, pending: 0 },
				pending: {},
				completed: {},
				rejected: {},
			},

		});

		const superUser = await admin.firestore().collection("superUser")
			.where("phoneNumber", "==", user.phoneNumber)
			.get()

		if (superUser.size > 0) {
			// set superUser role to user
			await admin.auth().setCustomUserClaims(user.uid, { superUser: true })
		}

		return
	});

