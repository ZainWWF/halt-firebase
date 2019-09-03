import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add entry into user's vehicle map when a vehicle doc is created*/
export default functions.firestore
	.document('vehicles/{vehicleId}').onCreate((snap, context) => {

		const newVehicle = snap.data() as FirebaseFirestore.DocumentData;
		const vehicleRef = 'vehicles/' + context.params.vehicleId

		return admin.firestore().doc(vehicleRef)
			.update({
				createdAt: admin.firestore.Timestamp.fromMillis(Date.now())
			})
			.then(() => {
				return admin.firestore().doc('users/' + newVehicle.userId).set({
					vehicles: {
						[context.params.vehicleId]: {
							ref: admin.firestore().doc(vehicleRef),
							license: newVehicle.license,
							make: newVehicle.make,
							url: newVehicle.url
						}
					}
				}, { merge: true })
			})
	})