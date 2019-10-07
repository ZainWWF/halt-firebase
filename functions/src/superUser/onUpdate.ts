import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}

/** edit/remove a super user*/
export default functions.region("asia-east2").firestore
	.document('superUser/{superUserId}').onUpdate(async (change, context) => {

		const previousData = change.before.data() as FirebaseFirestore.DocumentData;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;

		console.log("previousData: ", previousData)
		console.log("newData: ", newData)

		// do not check for changes in timestamp fields
		const { createdAt, ...restNewData } = newData
		const superUserRef = 'superUser/' + context.params.superUserId

		// if there is no change do nothing
		if (
			!isPropValueChanged(restNewData, previousData) &&
			Object.keys(newData).length === Object.keys(previousData).length
		) return null


		try {
			// restore
			await admin.firestore()
			.doc(superUserRef)
			.update(previousData)

			return;

		} catch (error) {
			console.error(error)

			return "Error: " + error;
		}

	})

