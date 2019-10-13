import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add mill rep user*/
export default functions.region("asia-east2").firestore
	.document('millReps/{millRepId}').onDelete(async (snap, context) => {
		try {

			const { userId, millId } = snap.data() as FirebaseFirestore.DocumentData;
			
			// a duplicate will be deleted when onCreate 
			// and it will trigger onDelete without userId on snapshot
			if(!userId) return;

			await admin.firestore().collection("profiles").doc(userId).update({
				millAdmins: admin.firestore.FieldValue.arrayRemove(millId)
			})

	
			await admin.firestore().doc(`users/${userId}`)
				.set({ mills: {} }, { mergeFields: ["mills"] })
			return;

		} catch (error) {
			console.error(error)

			return "Error: " + error;
		}



	})


