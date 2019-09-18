import * as admin from "firebase-admin"

export default async function (userId) {

	// refresh User.vehicle map with unremoved Vehicle docs for the userID
	const vehiclesSnapshot = await admin.firestore().collection("vehicles")
		.where("userId", "==", userId)
		.where("isRemoved", "==", false).get()

	return vehiclesSnapshot.docs.reduce((acc, vehicle) => {
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
}