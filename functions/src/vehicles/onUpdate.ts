import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return restNewData[key] !== previousData[key]
	})

}

/** update User.vehicle map entry when the vehicle document is updated */
export default functions.region("asia-east2").firestore
	.document('vehicles/{vehicleId}').onUpdate(async (change, context) => {
		const previousData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;;

		// do not check for changes in timestamp fields
		const { updatedAt, createdAt, removedAt, ...restNewData } = newData
		const vehicleRef = 'vehicles/' + context.params.vehicleId

		try {
			// check for changes in the Vehicle fields
			// if no change found, do not proceed
			if (!isPropValueChanged(restNewData, previousData)) return null

			// update doc with updatedAt fields
			await admin.firestore()
				.doc(vehicleRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			// extract the fields to 	update to User.vehicle map
			const updatedFields = ["license", "make", "model", "url"]
				.filter(field => restNewData[field] !== undefined)
				.reduce((acc, field) => {
					return { ...acc, [field]: restNewData[field] }
				}, {})


			await admin.firestore().doc(`users/${restNewData.userId}`).update({
				[`vehicles.${context.params.vehicleId}`]: {
					ref: admin.firestore().doc(vehicleRef),
					...updatedFields
				}

			})

			return

		} catch (error) {

			return "Error: " + error

		}

	});


