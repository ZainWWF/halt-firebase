import * as admin from "firebase-admin"

async function ownPlantationMapBuilder(userId) {

	console.log("***function: ownPlantationMapBuilder***")

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
				sortDate: plantation.data().createdAt
			}
		}
	}, {})
}


async function repPlantationMapBuilder(userId) {

	console.log("***function: repPlantationMapBuilder***")


	const plantationsCollectionRef = admin.firestore().collection("plantations")

	// refresh User.plantation map with unremoved Plantation docs for the repID
	const plantationsRepSnapshot = await plantationsCollectionRef
		.where("repIds", "array-contains", userId)
		.where("isRemoved", "==", false)
		.get()

	// get list of plantations Rep	
	return await plantationsRepSnapshot.docs.reduce(async (acc, plantation) => {

		const resolvedAcc = await Promise.resolve(acc)

		// get owner of plantation
		const producer = await admin.firestore().doc(`profiles/${plantation.data().userId}`).get()
		const producerData = producer.data();

		// owner and plantation id log
		console.log("Plantation Id: ", plantation.id)
		console.log("Producer Id:  ", plantation.data().userId)
		console.log("Producer name:  ", producerData!.name)

		// get the add/remove journal for the rep
		const repJournalSnap = await plantationsCollectionRef
			.doc(plantation.id)
			.collection("journal")
			.where("userId", "==", userId)
			.where("isRemoved", "==", false)
			.limit(1)
			.get()

		console.log("repJournal isEmpty?: ", repJournalSnap.empty)

		const addedAt = admin.firestore.Timestamp.fromMillis(Date.now())
		if (repJournalSnap.empty) {
			await plantationsCollectionRef
				.doc(plantation.id)
				.collection("journal").add({
					userId,
					addedAt,
					isRemoved: false
				})
		}

		const sortDate = repJournalSnap.empty ? addedAt : 	repJournalSnap.docs[0].data().addedAt
		console.log("sortDate: ", sortDate)

		return Promise.resolve({
			...resolvedAcc,
			[plantation.id]: {
				ref: plantation.ref,
				name: plantation.data().name,
				management: plantation.data().unAudited.management,
				auditAcceptedAt: plantation.data().auditAcceptedAt,
				isActive: plantation.data().isActive,
				repOfId: plantation.data().userId,
				repOfName: producerData && producerData.name ? producerData.name : null,
				sortDate 

			}
		})
	}, Promise.resolve({}))

}



export { ownPlantationMapBuilder, repPlantationMapBuilder } 