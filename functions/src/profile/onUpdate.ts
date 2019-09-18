import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import profileMapBuilder from "./mapBuilder";

const isPropValueChanged = (restNewData, previousData): boolean => {
	return Object.keys(restNewData).some((key) => {
		return JSON.stringify(restNewData[key]) !== JSON.stringify(previousData[key])
	})
}

/** update User.vehicle map entry when the vehicle document is updated */
export default functions.region("asia-east2").firestore
	.document('profiles/{userId}').onUpdate(async (change, context) => {

		const previousData = change.before.data() as FirebaseFirestore.DocumentData;;
		const newData = change.after.data() as FirebaseFirestore.DocumentData;

		// do not check for changes in timestamp fields
		const { updatedAt, createdAt, ...restNewData } = newData
		const profileRef = 'profiles/' + context.params.userId

		try {

			// check for changes in the Vehicle fields
			// if no change found, do not proceed
			if (!isPropValueChanged(restNewData, previousData)) return null

			await admin.firestore().
				doc(profileRef)
				.update({
					updatedAt: admin.firestore.Timestamp.fromMillis(Date.now())
				})

			// refresh User.profile map with Profile docs for the userID
			const profile = await profileMapBuilder(context.params.userId)

			await admin.firestore().doc('users/' + context.params.userId).set({
				profile
			}, { mergeFields: ["profile"] })

			return

		} catch (error) {

			return "Error: " + error

		}

	});
