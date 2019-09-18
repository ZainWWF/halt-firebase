import * as admin from "firebase-admin"

async function ownPlantationMapBuilder(userId) {

	// refresh User.plantation map with unremoved Plantation docs for the userID
	const plantationsOwnSnapshot = await admin.firestore().collection("plantations")
		.where("userId", "==", userId)
		.where("isRemoved", "==", false).get()

	// get list of plantations Owned	
	return plantationsOwnSnapshot.docs.reduce((acc, plantation) => {
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
}


async function repPlantationMapBuilder(userId) {

	// refresh User.plantation map with unremoved Plantation docs for the repID
	const plantationsRepSnapshot = await admin.firestore().collection("plantations")
		.where("repIds", "array-contains", userId)
		.where("isRemoved", "==", false).get()


	// get list of plantations Rep	
	return await plantationsRepSnapshot.docs.reduce(async (acc, plantation) => {

		const resolvedAcc = await Promise.resolve(acc)
		// const producer = await admin.auth().getUser(plantation.data().userId)
		const producer = await admin.firestore().doc(`profiles/${userId}`).get()
		const producerData = producer.data();


		return Promise.resolve({
			...resolvedAcc,
			[plantation.id]: {
				ref: plantation.ref,
				name: plantation.data().name,
				management: plantation.data().unAudited.management,
				auditAcceptedAt: plantation.data().auditAcceptedAt,
				isActive: plantation.data().isActive,
				repOfId: plantation.data().userId,
				repOfName: producerData && producerData.name ? producerData.name : null
			}
		})
	}, Promise.resolve({}))

}



export { ownPlantationMapBuilder, repPlantationMapBuilder } 