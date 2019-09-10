import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

const getPropValues = (data: any): any[] => {
	const { chassis, colour, license, loadingCapacity, make, url } = data;
	return [chassis, colour, license, loadingCapacity, make, url]
}

const isPropValueChanged = (change: functions.Change<FirebaseFirestore.DocumentSnapshot>): boolean => {

	const previousVehicleData = change.before.data() as FirebaseFirestore.DocumentData;;
	const newVehicleData = change.after.data() as FirebaseFirestore.DocumentData;;

	const previousVehiclePropValues = getPropValues(previousVehicleData);
	const newVehiclePropValues = getPropValues(newVehicleData);

	const changedPropValues = previousVehiclePropValues.filter(oldPropValue => {
		return !newVehiclePropValues.some((newPropValue) => {
			return oldPropValue === newPropValue
		})
	})

	return changedPropValues.length === 0 ? false : true;
}

/** update User.vehicle map entry when the vehicle document is updated */
export default functions.region("asia-east2").firestore
	.document('vehicles/{vehicleId}').onUpdate(async (change, context) => {

		try {
			if (!isPropValueChanged(change)) return null

			const vehicleRef = 'vehicles/' + context.params.vehicleId
			const newVehicleData = change.after.data() as FirebaseFirestore.DocumentData;;

			await admin.firestore()
				.doc(vehicleRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			await admin.firestore().doc('users/' + newVehicleData.userId).set({
				vehicles: {
					[context.params.vehicleId]: {
						ref: admin.firestore().doc(vehicleRef),
						license: newVehicleData.license,
						make: newVehicleData.make,
						url: newVehicleData.url
					}
				}
			}, { merge: true })

			return

		} catch (error) {

			return "Error: " + error

		}

	});


