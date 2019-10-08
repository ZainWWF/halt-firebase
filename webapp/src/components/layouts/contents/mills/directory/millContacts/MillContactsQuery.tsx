import React, { FunctionComponent, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from '../../../../../containers/Main';
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular"


type Props = {
	children: any
	selectedMillRef: firebase.firestore.DocumentReference | null
}
const FC: FunctionComponent<Props> = ({ children, selectedMillRef }) => {

	const [millContacts, setMillContacts] = useState<any[] | null>(null)
	const [isRetrievingMillContacts, setIsRetrievingMillContacts] = useState(false)

	const user = useContext(AuthContext)
	const isSuperUser = user!.claims!.superUser;

	const getMillContactsCalback = useCallback((
	) => {
		let isSubscribed = true
		setIsRetrievingMillContacts(true)
		if (selectedMillRef) {

			selectedMillRef.collection("millReps")
				.get()
				.then((millRepsData) => {

					const millRepContacts = millRepsData.docs.map(millRep => {
						return { ...millRep.data(), ref: millRep.ref }
					})

					if (isSuperUser) {
						selectedMillRef.collection("millAdmins")
							.get()
							.then((millAdminsData) => {
								if (isSubscribed) {
									console.log("retrieve done")
									const millAdminContacts = millAdminsData.docs.map(millAdmin => {
										return { ...millAdmin.data(), ref: millAdmin.ref }
									})
									setMillContacts({ ...millAdminContacts, ...millRepContacts })
									setIsRetrievingMillContacts(false)
								}
							}).catch((error: Error) => {
								console.error(error)
							})
					} else {
						if (isSubscribed) {
							console.log("retrieve done")
							setMillContacts(millRepContacts)
							setIsRetrievingMillContacts(false)
						}
					}

				}).catch((error: Error) => {
					console.error(error)
				})



		}



		return () => { isSubscribed = false }
	}, [selectedMillRef, isSuperUser])


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