
import * as admin from "firebase-admin"

export const millContactCreate = async (snap) => {

	try {

		const { phoneNumber, createdAt, name } = snap.data() as FirebaseFirestore.DocumentData;

		// if this doc has a createdAt field, it means its doc id has been changed to the userId
		// so don't continue.
		if (createdAt) return
		console.log("creating contact: ", phoneNumber)

		let user;
		let existingName = null;

		try {
			// check if number is in firebaseAuth
			user = await admin.auth().getUserByPhoneNumber(phoneNumber)
			console.log("user already exist in auth database!")
			// get existing name from profile
			const existingUserSnap = await admin.firestore().collection("profiles").doc(user.uid).get()
			if(existingUserSnap.exists && 	existingUserSnap.data()!.name)  {			
				if (existingUserSnap.data()!.name.length > 0 )
				existingName = existingUserSnap.data()!.name
				console.log("existing name: ", existingName)
			}

		} catch (error) {

			console.log("create new user")
			// create new user
			user = await admin.auth().createUser({ phoneNumber })
			await admin.firestore().collection("profiles").doc(user.uid).set({ name, phoneNumber })
		}

		// create new mills contact doc with user id as the doc id
		console.log("creating: ", user.uid)
		await snap.ref.parent.doc(user.uid).set({
			...snap.data(),
			createdAt: admin.firestore.Timestamp.fromMillis(Date.now()),
			name : existingName ? existingName :  name
		})

		// delete the old doc
		console.log("deleting: ", snap.ref.path)
		await snap.ref.delete();

		return;

	} catch (error) {
		console.error(error)
		await snap.ref.delete();
		return "Error: " + error;
	}








}