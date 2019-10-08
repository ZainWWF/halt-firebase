import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, Dispatch, SetStateAction, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../containers/Main";
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular";

export const MillRepFormContext = createContext<any>(undefined)

type Props = {
	children: (props: Dispatch<SetStateAction<any>>) => ReactElement<any>
	openMillRep: any
	onCloseMillRep: any
	millRepRef: firebase.firestore.DocumentReference
}
const FC: FunctionComponent<Props> = ({ children, openMillRep, onCloseMillRep, millRepRef }) => {

	const user = useContext(AuthContext) as firebase.User;

	const [newMillRep, setNewMillRep] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const newMillRepCallback = useCallback(() => {

		millRepRef.collection("millReps").add({
			registrarId: user.uid,
			...newMillRep
		}).then(() => {
			console.log("upload success")
			setNewMillRep(null)
			setIsUploading(false)
			onCloseMillRep()
		}).catch((error: Error) => {
			console.log(error)
		})
	}, [newMillRep, onCloseMillRep, millRepRef, user])

	useEffect((
	) => {
		if (newMillRep) {
			setIsUploading(true)
			newMillRepCallback()
		}
	}, [newMillRep, newMillRepCallback])

	return (isUploading ?
		<PleaseWaitCircular />
		:
		<MillRepFormContext.Provider value={{ openMillRep, onCloseMillRep }}>
			{children(setNewMillRep)}
		</MillRepFormContext.Provider>
	)
}
export default FC