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
		const { updatedAt, createdAt, ...restNewData } = newData
		const vehiclePath = 'vehicles/' + context.params.vehicleId

		try {
			// check for changes in the Vehicle fields
			// if no change found, do not proceed
			if (!isPropValueChanged(restNewData, previousData)) return null

			// update doc with updatedAt fields
			await admin.firestore()
				.doc(vehiclePath)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

	
			// refresh User.vehicle map with unremoved Vehicle docs for the userID
			const vehiclesSnapshot = await admin.firestore().collection("vehicles")
				.where("userId", "==", previousData.userId)
				.where("isRemoved", "==", false).get()

			const vehiclesMap = vehiclesSnapshot.docs.reduce((acc, vehicle) => {
				return {
					...acc,
					[vehicle.id]: {
						ref: vehicle.ref,
						license: vehicle.data().license,
						make: vehicle.data().make,
						model: vehicle.data().model,
						url: vehicle.data().url,
					}
				}
			}, {})


			await admin.firestore().doc(`users/${previousData.userId}`).set({ vehicles: vehiclesMap }, { mergeFields: ["vehicles"] })
			return

		} catch (error) {

			return "Error: " + error

		}

	});


