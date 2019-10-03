import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}

/** update User.assistance map entry when the assistance document is updated */
export default functions.region("asia-east2").firestore
	.document('assistance/{assistanceId}').onUpdate(async (change, context) => {
		const previousData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;;

		// do not check for changes in timestamp fields
		const { updatedAt, createdAt, ...restNewData } = newData
		const assistancePath = 'assistance/' + context.params.assistanceId

		try {
			// check for changes in the Assistance fields
			// if no change found, do not proceed
			if (!isPropValueChanged(restNewData, previousData)) return null

			// update doc with updatedAt fields
			await admin.firestore()
				.doc(assistancePath)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			return

		} catch (error) {

			return "Error: " + error

		}

	});


