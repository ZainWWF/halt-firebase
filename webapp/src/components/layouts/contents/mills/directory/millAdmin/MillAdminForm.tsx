import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, Dispatch, SetStateAction, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../containers/Main";
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular";

export const MillAdminFormContext = createContext<any>(undefined)

type Props = {
	children: (props: Dispatch<SetStateAction<any>>) => ReactElement<any>
	openMillAdmin: any
	onCloseMillAdmin: any
	millAdminRef: firebase.firestore.DocumentReference
}
const FC: FunctionComponent<Props> = ({ children, openMillAdmin, onCloseMillAdmin, millAdminRef }) => {

	const user = useContext(AuthContext) as firebase.User;

	const [newMillAdmin, setNewMillAdmin] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const newMillAdminCallback = useCallback(() => {

		millAdminRef.collection("millAdmin").add({
			registrarId: user.uid,
			...newMillAdmin
		}).then(() => {
			console.log("upload success")
			setNewMillAdmin(null)
			setIsUploading(false)
			onCloseMillAdmin()
		}).catch((error: Error) => {
			console.log(error)
		})
	}, [newMillAdmin, onCloseMillAdmin, millAdminRef, user])

	useEffect((
	) => {
		if (newMillAdmin) {
			setIsUploading(true)
			newMillAdminCallback()
		}
	}, [newMillAdmin, newMillAdminCallback])

	return (isUploading ?
		<PleaseWaitCircular />
		:
		<MillAdminFormContext.Provider value={{ openMillAdmin, onCloseMillAdmin }}>
			{children(setNewMillAdmin)}
		</MillAdminFormContext.Provider>
	)
}
export default FC