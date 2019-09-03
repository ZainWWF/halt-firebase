import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** update User.vehicle map entry when the vehicle document is updated */
export default functions.firestore
	.document('vehicles/{vehicleId}').onUpdate((change, context) => {

		const getPropValues = (data: any) => {
			const { chassis, colour, license, loadingCapacity, make, url } = data;
			return [chassis, colour, license, loadingCapacity, make, url]
		}

		const previousVehicleData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newVehicleData = change.after.data() as FirebaseFirestore.DocumentData;;

		const previousVehiclePropValues = getPropValues(previousVehicleData);
		const newVehiclePropValues = getPropValues(newVehicleData);

		const changedPropValues = previousVehiclePropValues.filter(oldPropValue => {
			return !newVehiclePropValues.some((newPropValue) => {
				return oldPropValue === newPropValue
			})
		})

		/** no change was found so return null */
		if (changedPropValues.length === 0) return null;

		const vehicleRef = 'vehicles/' + context.params.vehicleId
		return admin.firestore().doc(vehicleRef)
			.update({
				updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
			})
			.then(() => {
				return admin.firestore().doc('users/' + newVehicleData.userId).set({
					vehicles: {
						[context.params.vehicleId]: {
							ref: admin.firestore().doc(vehicleRef),
							license: newVehicleData.license,
							make: newVehicleData.make,
							url: newVehicleData.url
						}
					}
				}, { merge: true })
			})
	});
