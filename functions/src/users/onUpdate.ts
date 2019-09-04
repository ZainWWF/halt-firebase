import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

/** update the vehicle collection when a the user's vehicle map entry is removed*/
export default functions.region("asia-east2").firestore
	.document('users/{userId}').onUpdate((change, context) => {

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
				return removedVehicleRef.update({
					removedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})
			}
		}

		// no change in size so its a change in field values which is not allowed
		if (newVehicleMap.size === previousVehicleMap.size) {
			// no change if field values so return null to break out of loop
			if(compareMapsIsIdentical(newVehicleMap,previousVehicleMap)) return null;
			return admin.firestore().doc(`users/${context.params.userId}`).update(previousUserData.vehicles)
		}

		return null
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

function compareMapsIsIdentical(map1: Map<string, any>,  map2:Map<string, any> ):boolean {
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
