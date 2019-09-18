import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import { ownPlantationMapBuilder, repPlantationMapBuilder } from "./mapBuilder"


const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}

/** update user's plantation map entry when the plantation document is updated */
export default functions.region("asia-east2").firestore
	.document('plantations/{plantationId}').onUpdate(async (change, context) => {
		const previousData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;

		// do not check for changes in timestamp fields
		const { updatedAt, createdAt, auditAcceptedAt, ...restNewData } = newData
		const plantationRef = 'plantations/' + context.params.plantationId

		try {
			// check for changes in the fields
			// if no change found, do not proceed
			if (!isPropValueChanged(restNewData, previousData)) return null

			await admin.firestore()
				.doc(plantationRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			// refresh User.plantation map with unremoved Plantation docs for the userID
			const plantationsOwnMap = await ownPlantationMapBuilder(previousData.userId)

			// refresh User.plantation map with unremoved Plantation docs for the repID
			const plantationsRepMap = await repPlantationMapBuilder(previousData.userId)

			await admin.firestore().doc(`users/${previousData.userId}`)
				.set({ plantations: { ...plantationsOwnMap, ...plantationsRepMap } }, { mergeFields: ["plantations"] })

			// remove the Producer/Plantation reps plantation map entries
			await removeUserRepPlantation(previousData, newData, plantationRef)

			// update all current and add new the Producer/Plantation reps plantation map entries
			await updateUserRepPlantation(newData, plantationRef)

			return

		} catch (error) {
			console.log(error)
			return "Error: " + error;

		}

	});


async function removeUserRepPlantation(previousData, newData, plantationRef) {

	if (!previousData.repIds || !newData.repIds) return;

	console.log("previousData.repIds: ", previousData.repIds)
	console.log("newData.repIds: ", newData.repIds)


	if (previousData.repIds.length > newData.repIds.length) {

		const removedRepIds = previousData.repIds.filter(prevRepId => !(newData.repIds.some((newRepId) => newRepId === prevRepId)))

		console.log(removedRepIds)

		console.log("plantationRef", plantationRef.replace("/", "."))
		await Promise.all(
			removedRepIds.map(async repId => await admin.firestore().doc(`users/${repId}`).update({
				[plantationRef.replace("/", ".")]: admin.firestore.FieldValue.delete()
			}))

		)
		return
	}


	return
}

// update all the Producer/Plantation reps plantation map entries
async function updateUserRepPlantation(newData, plantationRef) {

	if (!newData.repIds || newData.repIds.length === 0) return;

	const producer = await admin.firestore().doc(`profiles/${newData.userId}`).get();
	const producerData = producer.data();

	console.log("newData:  ", newData)
	console.log("producer:  ", producer)

	await Promise.all(newData.repIds.map(async repId => await admin.firestore().doc(`users/${repId}`)
		.update({
			[plantationRef.replace("/", ".")]: {
				ref: admin.firestore().doc(plantationRef),
				name: newData.name,
				management: newData.unAudited.management,
				auditAcceptedAt: newData.auditAcceptedAt,
				isActive: newData.isActive,
				repOfId: newData.userId,
				repOfName: producerData && producerData.name ? producerData.name : null
			}
		})))

	return

}