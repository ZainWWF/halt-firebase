import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"

/** update User.vehicle map entry when the vehicle document is updated */
export default functions.region("asia-east2").firestore
	.document('vehicles/{vehicleId}').onUpdate(async (change, context) => {

		const newVehicleData = change.after.data() as FirebaseFirestore.DocumentData;;
		const vehicleRef = 'vehicles/' + context.params.vehicleId

		try {

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

			return Error
		}

	});
