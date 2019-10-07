import * as functions from 'firebase-functions';

const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}

/** edit/remove a millAdmin*/
export default functions.region("asia-east2").firestore
	.document('mills/{millId}/millAdmin/{millAdminId}').onUpdate(async (change, context) => {

		const previousData = change.before.data() as FirebaseFirestore.DocumentData;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;

		console.log("previousData: ", previousData)
		console.log("newData: ", newData)

		// do not check for changes in timestamp fields
		const { createdAt, ...restNewData } = newData

		// if there is no change do nothing
		if (
			!isPropValueChanged(restNewData, previousData) &&
			Object.keys(newData).length === Object.keys(previousData).length
		) return null


		try {
			// restore
			await change.after.ref.update(previousData)

			return;

		} catch (error) {
			console.error(error)

			return "Error: " + error;
		}

	})

