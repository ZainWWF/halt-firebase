import * as admin from "firebase-admin"

export default async function (userId) {

	// refresh User.vehicle map with unremoved Vehicle docs for the userID
	const millRepsSnapshot = await admin.firestore().collection("millReps")
		.where("userId", "==", userId)
		.get()

	return millRepsSnapshot.docs.reduce((acc, rep) => {
		return {
			...acc,
			[rep.id]: {
				ref: rep.ref,
				millId: rep.data().millId,
				millName: rep.data().millName,
			}
		}
	}, {})
}