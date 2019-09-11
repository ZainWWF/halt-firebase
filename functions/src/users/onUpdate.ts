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
					// add field to show that vehicle has been removed z
					return await removedVehicleRef.update({
						removedAt: admin.firestore.Timestamp.fromMillis(Date.now())
					})
				}
			}

			// no change in size so its a change in field values which is not allowed
			if (newVehicleMap.size === previousVehicleMap.size) {
				// no change if field values so return null to break out of loop
				if (compareMapsIsIdentical(newVehicleMap, previousVehicleMap)) return null;

				// get the changed User.vehicle data
				const [editedVehicleId] = [...newVehicleMap.keys()]
				const [editedUserVehicleMap]: Map<string, any>[] = [...newVehicleMap.values()]

				// get the Vehicle Doc
				const vehicleRef = admin.firestore().doc(`vehicles/${editedVehicleId}`)
				const vehicleDoc = await vehicleRef.get()
				const vehicleDocData = vehicleDoc.data() as FirebaseFirestore.DocumentData;

				// check for any changes in the User.vehicle map entries
				const isChanged = Object.keys(editedUserVehicleMap).some(key => {
					// compare User.vehicle data with Vehicle doc
					if (key === "ref") {
						if (vehicleDocData["ref"]) {
							return vehicleDocData["ref"]["path"] !== editedUserVehicleMap["ref"]["path"]
						}
					}
					return vehicleDocData[key] !== editedUserVehicleMap[key]
				})

				// no change in the User.vehicle map entries, exit
				if (!isChanged) return

				// data has changed, overwrite User.vehicle map for the editedVehicleId 
				// from the Vehicle document
				const updatedFields = ["license", "make", "model", "url"]
					.filter(field => vehicleDocData[field] !== undefined)
					.reduce((acc, field) => {
						return { ...acc, [field]: vehicleDocData[field] }
					}, {})


				return admin.firestore().doc(`users/${context.params.userId}`).update({
					[`vehicles.${editedVehicleId}`]: {
						ref: vehicleRef,
						...updatedFields
					}
				})
			}

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

function compareMapsIsIdentical(map1: Map<string, any>, map2: Map<string, any>): boolean {
	for (const [key, val] of map1) {
		const testVal = map2.get(key);
		// in cases of an undefined value, make sure the key
		// actually exists on the object so there are no false positives
		if (testVal !== val || (testVal === undefined && !map2.has(key))) {
			return false;
		}
	}
	return true;
}
