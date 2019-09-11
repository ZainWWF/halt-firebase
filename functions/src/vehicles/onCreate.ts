import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** add entry into user's vehicle map when a vehicle doc is created*/
export default functions.region("asia-east2").firestore
	.document('vehicles/{vehicleId}').onCreate(async (snap, context) => {

		try {

			const newVehicle = snap.data() as FirebaseFirestore.DocumentData;
			const vehicleRef = 'vehicles/' + context.params.vehicleId

			await admin.firestore().doc(vehicleRef)
				.update({
					createdAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			await admin.firestore().doc('users/' + newVehicle.userId).set({
				vehicles: {
					[context.params.vehicleId]: {
						ref: admin.firestore().doc(vehicleRef),
						license: newVehicle.license,
						make: newVehicle.make,
						model: newVehicle.model,
						url: newVehicle.url
					}
				}
			}, { merge: true })

			return

		} catch (error) {

			return "Error: " + error
		}


	})