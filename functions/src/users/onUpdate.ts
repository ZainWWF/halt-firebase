import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

import vehicleMapBuilder from "../vehicles/mapBuilder";
import profileMapBuilder from "../profile/mapBuilder";
import { ownPlantationMapBuilder, repPlantationMapBuilder } from "../plantations/mapBuilder"

/** update the vehicle collection when a the user's vehicle map entry is removed*/
export default functions.region("asia-east2").firestore
	.document('users/{userId}').onUpdate(async (change, context) => {
		try {
			const previousUserData = change.before.data() as FirebaseFirestore.DocumentData;
			const newUserData = change.after.data() as FirebaseFirestore.DocumentData;

			// if any if the Map field has been deleted skip the check and immediately restore
			if (newUserData.vehicles && newUserData.plantations && newUserData.profile) {

				// check for changes in vehicles
				const previousUserDataVehicles = previousUserData.vehicles ? previousUserData.vehicles : {}
				const previousVehicleMap = new Map(Object.entries(previousUserDataVehicles));
				const newVehicleMap = new Map(Object.entries(newUserData.vehicles));

				// check if a User.vehicle entry has been removed and update Vehicle if true
				if (await syncRemovedMapWithDoc(newVehicleMap, previousVehicleMap)) return;

				// check for changes in plantations
				const previousUserDataPlantations = previousUserData.plantations ? previousUserData.plantations : {}
				const previousPlantationMap = new Map(Object.entries(previousUserDataPlantations));
				const newPlantationMap = new Map(Object.entries(newUserData.plantations));

				// check if a User.plantation entry has been removed and update Plantation if true
				if (await syncRemovedMapWithDoc(newPlantationMap, previousPlantationMap)) return;

			}

			// refresh User.vehicle map with unremoved Vehicle docs for the userID
			const vehiclesMap = await vehicleMapBuilder(context.params.userId)

			// refresh User.plantation map with unremoved Plantation docs for the userID
			const plantationsOwnMap = await ownPlantationMapBuilder(context.params.userId)

			// refresh User.plantation map with unremoved Plantation docs for the repID
			const plantationsRepMap = await repPlantationMapBuilder(context.params.userId)

			// refresh User.profile map with Profile docs for the userID
			const profile = await profileMapBuilder(context.params.userId)

			await admin.firestore().doc(`users/${context.params.userId}`)
				.set({
					profile,
					vehicles: vehiclesMap,
					plantations: { ...plantationsOwnMap, ...plantationsRepMap }

				})
			return

		} catch (error) {
			console.log(error)
			return "Error: " + error

		}
	});




// check if Doc can be tagged with the removed field by looking at the
// the control fields for Doc removal

async function isRemoveDenied(removedRef): Promise<boolean> {

	const removedDoc = await removedRef.get();
	const removedDocData = removedDoc.data();

	console.log("removedDocData: ", removedDocData)
	const removeControlFields = Object.keys(removedDocData)
		.filter(key => ["isActive", "auditAt"].includes(key))

	// console.log	
	removeControlFields.map(field => console.log(`check item: ${field} : ${removedDocData[field]}`))

	// deny remove if the field value is false eq, isActive=false 
	// or field does not exist
	const isDenied = removeControlFields
		.some(field => !!removedDocData[field] !== false)

	return isDenied
}

// update the Doc associated with the removed map entry with "isRemoved : true"
async function syncRemovedMapWithDoc(newMap, previousMap): Promise<boolean> {

	// new size is smaller so its is delete
	if (newMap.size < previousMap.size) {
		const removedRef = getRemovedRef(previousMap, newMap);

		// check the control fields of the associated Doc if allows remove action
		if (await isRemoveDenied(removedRef)) return false;
		console.log("removing: ", removedRef!.path)

		if (removedRef) {
			// add field to show that  doc has been removed 
			await removedRef.update({
				isRemoved: true
			})
			return true
		}
	}
	return false
}

// get the doc reference to the map entry that has been removed 
function getRemovedRef(previousMap: Map<string, any>, newMap: Map<string, any>): FirebaseFirestore.DocumentReference | null {

	const previousKeys = [...previousMap.keys()]
	console.log("previousMap", previousMap.get(previousKeys[0]))

  // the removed item is from a rep not owner so dont delete the referenced doc
	if(previousMap.get(previousKeys[0]).repOfId) return null;

	// all items has been deleted 
	// return the value of the ref field in the removed doc		
	if (newMap.size === 0) return previousMap.get(previousKeys[0]).ref

	/** compare and filter the maps to get the deleted key*/
	/** only support a single entry delete  */
	const [removedKey] = previousKeys
		.filter((previousKey: any) => ![...newMap.keys()]
			.some((newKey: any) => newKey === previousKey))

	// return the value of the ref field in the removed doc		
	return previousMap.get(removedKey).ref
}

