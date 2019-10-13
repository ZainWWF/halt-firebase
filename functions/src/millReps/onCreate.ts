import * as functions from 'firebase-functions';
import * as admin from "firebase-admin"
import millRepBuilder from "./mapBuilder"
/** new mill rep user*/
export default functions.region("asia-east2").firestore
	.document('millReps/{millRepId}').onCreate(async (snap, context) => {

		try {

			const { phoneNumber, name, isAdmin, millId } = snap.data() as FirebaseFirestore.DocumentData;

			// if this doc has a createdAt field, it means its doc id has been changed to the userId
			// so don't continue.
			// if (createdAt) return
			// console.log("creating contact: ", phoneNumber)



			let user;
			let existingName = null;

			try {
				// check if number is in firebaseAuth
				user = await admin.auth().getUserByPhoneNumber(phoneNumber)
				console.log("user already exist in auth database!")
				// get existing name from profile
				const existingUserSnap = await admin.firestore().collection("profiles").doc(user.uid).get()
				if (existingUserSnap.exists && existingUserSnap.data()!.name) {
					if (existingUserSnap.data()!.name.length > 0)
						existingName = existingUserSnap.data()!.name
					console.log("existing name: ", existingName)

					// update the Profile doc
					await existingUserSnap.ref.update({
						millAdmins: isAdmin ? admin.firestore.FieldValue.arrayUnion(millId) : []
					})
				}

			} catch (error) {

				console.log("create new user")
				// create new user				
				user = await admin.auth().createUser({ phoneNumber })
				await admin.firestore().collection("profiles")
					.doc(user.uid).set({
						name,
						phoneNumber,
						millAdmins: isAdmin ? [millId] : []
					})
			}

			// find same userId with millRep and
			// delete this record to prevent duplicate and exit!
			const duplicateMillReps = await admin.firestore().collection("millReps")
				.where("millId", "==", millId)
				.where("userId", "==", user.uid)
				.get()
			if (duplicateMillReps.size > 0) {
				await snap.ref.delete();
				return
			}

			// update RepMills doc with user id 
			console.log("updating: ", user.uid)
			await snap.ref.update({
				...snap.data(),
				userId: user.uid,
				createdAt: admin.firestore.Timestamp.fromMillis(Date.now()),
				name: existingName ? existingName : name,

			})

			// update the User.mills	
			const millsMap = await millRepBuilder(user.uid)
			await admin.firestore().doc(`users/${user.uid}`)
				.set({ mills: millsMap }, { mergeFields: ["mills"] })

			return;

		} catch (error) {
			console.error(error)

			return "Error: " + error;
		}



	})


