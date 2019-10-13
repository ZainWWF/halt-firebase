import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, Dispatch, SetStateAction, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../containers/Main";
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular";
import { FirebaseContext, Firebase } from '../../../../../providers/Firebase/FirebaseProvider';


export const MillContactFormContext = createContext<any>(undefined)

type Props = {
	children: (props: Dispatch<SetStateAction<any>>) => ReactElement<any>
	openMillContact: any
	onCloseMillContact: any
	selectedMill: any
}
const FC: FunctionComponent<Props> = ({ children, openMillContact, onCloseMillContact, selectedMill }) => {
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const user = useContext(AuthContext) as firebase.User;

	const [newMillContact, setNewMillContact] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const newMillContactCallback = useCallback(() => {
		const millRep = {
			registrarId: user.uid,
			millId: selectedMill.ref.id,
			millName: selectedMill.name,
			...newMillContact
		}

		console.log(millRep)

		firebaseApp.db.collection("millReps")
		.add(millRep)
		.then(() => {
			console.log("upload success")
			setNewMillContact(null)
			setIsUploading(false)
			onCloseMillContact()
		}).catch((error: Error) => {
			console.log(error)		
			setNewMillContact(null)
			setIsUploading(false)
			onCloseMillContact()
		})

	}, [newMillContact, onCloseMillContact, selectedMill, user, firebaseApp])

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