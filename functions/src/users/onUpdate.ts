import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

/** update the vehicle collection when a the user's vehicle map entry is removed*/
export default functions.region("asia-east2").firestore
	.document('users/{userId}').onUpdate(async (change, context) => {
		try {
			const previousUserData = change.before.data() as FirebaseFirestore.DocumentData;
			const newUserData = change.after.data() as FirebaseFirestore.DocumentData;

			// check for changes in vehicles
			const previousVehicleMap = new Map(Object.entries(previousUserData.vehicles));
			const newVehicleMap = new Map(Object.entries(newUserData.vehicles));

			// check if a User.vehicle entry has been removed and update Vehicle if true
			if (await syncRemovedMapWithDoc(newVehicleMap, previousVehicleMap)) return;


			// check for changes in plantations
			const previousPlantationMap = new Map(Object.entries(previousUserData.plantations));
			const newPlantationMap = new Map(Object.entries(newUserData.plantations));

			// check if a User.plantation entry has been removed and update Plantation if true
			if (await syncRemovedMapWithDoc(newPlantationMap, previousPlantationMap)) return;


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

			// refresh User.plantation map with unremoved Vehicle docs for the userID
			const plantationsSnapshot = await admin.firestore().collection("plantations")
				.where("userId", "==", context.params.userId)
				.where("isRemoved", "==", false).get()

			const plantationsMap = plantationsSnapshot.docs.reduce((acc, plantation) => {
				return {
					...acc,
					[plantation.id]: {
						ref: plantation.ref,
						name: plantation.data().name,
						management: plantation.data().unAudited.management,
						auditAcceptedAt: plantation.data().auditAcceptedAt,
						isActive: plantation.data().isActive,
					}
				}
			}, {})


			await admin.firestore().doc(`users/${context.params.userId}`)
				.set({
					vehicles: vehiclesMap,
					plantations: plantationsMap

				}, { mergeFields: ["vehicles", "plantations"] })
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
	const removeControlFields = Object.keys(removedDocData)
		.filter(key => ["isActive", "auditAt"].includes(key))
		removeControlFields.map(field => console.log(`${field} : ${removedDocData[field]}`))

	return removeControlFields
		.some(field => removedDocData[field] === true || removedDocData[field] !== null)
}


async function syncRemovedMapWithDoc(newMap, previousMap): Promise<boolean> {

	// new size is smaller so its is delete
	if (newMap.size < previousMap.size) {
		const removedRef = getRemovedRef(previousMap, newMap);

		if (await isRemoveDenied(removedRef)) return false;

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


function getRemovedRef(previousMap: Map<string, any>, newMap: Map<string, any>): FirebaseFirestore.DocumentData | null {

	const previousKeys = [...previousMap.keys()]

	// all items has been deleted 
	// return the value of the ref field in the removed doc		
	if (newMap.size === 0) return previousMap.get(previousKeys[0]).ref

	/** compare and filter the maps to get the deleted key*/
	const [removedKey] = previousKeys
		.filter((previousKey: any) => ![...newMap.keys()]
			.some((newKey: any) => newKey === previousKey))

	// return the value of the ref field in the removed doc		
	return previousMap.get(removedKey).ref
}

