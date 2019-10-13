import React, { FunctionComponent, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from '../../../../../containers/Main';
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular"
import { FirebaseContext, Firebase } from '../../../../../providers/Firebase/FirebaseProvider';


type Props = {
	children: any
	selectedMillRef: firebase.firestore.DocumentReference | null
}
const FC: FunctionComponent<Props> = ({ children, selectedMillRef }) => {

	const [millContacts, setMillContacts] = useState<any[] | null>(null)
	const [isRetrievingMillContacts, setIsRetrievingMillContacts] = useState(false)
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const user = useContext(AuthContext)
	const isSuperUser = user!.claims!.superUser;

	const getMillContactsCalback = useCallback((
	) => {
		let isSubscribed = true
		setIsRetrievingMillContacts(true)
		if (selectedMillRef) {

			console.log(selectedMillRef.id)	
			firebaseApp.db.collection("millReps")
			.where("millId", "==", selectedMillRef.id)
				.get()
				.then((millRepsData) => {
					if (isSubscribed) {
						console.log("retrieve done")
						const millRepContacts = millRepsData.docs.map(millRep => {
							return { ...millRep.data(), ref: millRep.ref }
						})
						setMillContacts([...Object.values(millRepContacts)])
						setIsRetrievingMillContacts(false)
					}
		
				}).catch((error: Error) => {
					console.error(error)
					setIsRetrievingMillContacts(false)
				})
		}

		return () => { isSubscribed = false }
	}, [selectedMillRef, firebaseApp  ])


	useEffect(() => {
		getMillContactsCalback()
	}, [getMillContactsCalback])


	return (isRetrievingMillContacts ?
		<PleaseWaitCircular />
		:
		<>{children(millContacts)}</>
	)
}
export default FC