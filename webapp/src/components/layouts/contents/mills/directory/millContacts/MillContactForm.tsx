import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, Dispatch, SetStateAction, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../containers/Main";
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular";

export const MillContactFormContext = createContext<any>(undefined)

type Props = {
	children: (props: Dispatch<SetStateAction<any>>) => ReactElement<any>
	openMillContact: any
	onCloseMillContact: any
	millContactRef: firebase.firestore.DocumentReference
}
const FC: FunctionComponent<Props> = ({ children, openMillContact, onCloseMillContact, millContactRef }) => {

	const user = useContext(AuthContext) as firebase.User;

	const [newMillContact, setNewMillContact] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const newMillContactCallback = useCallback(() => {
		if (newMillContact.isAdmin) {

			millContactRef.collection("millAdmins").add({
				registrarId: user.uid,
				...newMillContact
			}).then(() => {
				console.log("upload success")
				setNewMillContact(null)
				setIsUploading(false)
				onCloseMillContact()
			}).catch((error: Error) => {
				console.log(error)
			})


		} else {

			millContactRef.collection("millReps").add({
				registrarId: user.uid,
				...newMillContact
			}).then(() => {
				console.log("upload success")
				setNewMillContact(null)
				setIsUploading(false)
				onCloseMillContact()
			}).catch((error: Error) => {
				console.log(error)
			})

		}

	}, [newMillContact, onCloseMillContact, millContactRef, user])

	useEffect((
	) => {
		if (newMillContact) {
			setIsUploading(true)
			newMillContactCallback()
		}
	}, [newMillContact, newMillContactCallback])

	return (isUploading ?
		<PleaseWaitCircular />
		:
		<MillContactFormContext.Provider value={{ openMillContact, onCloseMillContact }}>
			{children(setNewMillContact)}
		</MillContactFormContext.Provider>
	)
}
export default FC