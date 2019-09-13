import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

/** update the vehicle collection when a the user's vehicle map entry is removed*/
export default functions.region("asia-east2").firestore
	.document('users/{userId}').onUpdate(async (change, context) => {
		try {
			const previousUserData = change.before.data() as FirebaseFirestore.DocumentData;
			const newUserData = change.after.data() as FirebaseFirestore.DocumentData;

			// changes in plantations and profile is not allowed by securty rules 
			// so we only check for changes in vehicles
			const previousVehicleMap = new Map(Object.entries(previousUserData.vehicles));
			const newVehicleMap = new Map(Object.entries(newUserData.vehicles));

			// newVehicle size is smaller so its is delete
			if (newVehicleMap.size < previousVehicleMap.size) {
				const removedVehicleRef = getRemovedVehicleRef(previousVehicleMap, newVehicleMap)
				if (removedVehicleRef) {
					// add field to show that Vehicle doc has been removed 
					await removedVehicleRef.update({
						isRemoved: true
					})
					return
				}
			}

			// refresh User.vehicle map with unremoved Vehicle docs for the userID
			const vehiclesSnapshot = await admin.firestore().collection("vehicles")
				.where("userId", "==", context.params.userId)
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

			await admin.firestore().doc(`users/${context.params.userId}`).set({ vehicles: vehiclesMap }, { mergeFields: ["vehicles"] })
			return

		} catch (error) {

			console.log(error)
			return "Error: " + error

		}

	});


function getRemovedVehicleRef(previousVehicleMap: Map<string, any>, newVehicleMap: Map<string, any>): FirebaseFirestore.DocumentData | null {

	const previousVehicleKeys = [...previousVehicleMap.keys()]

	// all vehicle items has been deleted 
	// return the value of the ref field in the removed doc		
	if (newVehicleMap.size === 0) return previousVehicleMap.get(previousVehicleKeys[0]).ref

	/** compare and filter the maps to get the deleted key*/
	const [removedVehiclekey] = previousVehicleKeys
		.filter((previousVehicleKey: any) => ![...newVehicleMap.keys()]
			.some((newVehicleKey: any) => newVehicleKey === previousVehicleKey))

	// return the value of the ref field in the removed doc		
	return previousVehicleMap.get(removedVehiclekey).ref
}

