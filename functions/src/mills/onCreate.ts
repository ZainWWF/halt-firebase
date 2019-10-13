import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** new mill */
export default functions.region("asia-east2").firestore
	.document('mills/{millsId}').onCreate(async (snap, context) => {

		try {

			await admin.firestore().doc('tradeboard/' + context.params.millsId).set({
				holdings: { onhand: 0, pending: 0 },
				pending: {},
				completed: {},
				rejected: {},
			});
	
			return;
	
		} catch (error) {
			console.error(error)

			return "Error: " + error;
		}
	
	
	
	})


	