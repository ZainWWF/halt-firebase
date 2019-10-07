import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, Dispatch, SetStateAction, useContext, useCallback } from "react";
import { FirebaseContext, Firebase } from '../../../providers/Firebase/FirebaseProvider';
import { AuthContext } from "../../../containers/Main";
import PleaseWaitCircular from "../../../progress/PleaseWaitCircular"

export const AssistanceFormContext = createContext<any>(undefined)

type Props = {
	children: (props: Dispatch<SetStateAction<any>>) => ReactElement<any>
	openAssistance: any
	onCloseAssistance: any
}
const FC: FunctionComponent<Props> = ({ children, openAssistance, onCloseAssistance }) => {
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const user = useContext(AuthContext) as firebase.User;

	const [assistanceRequest, setAssistanceRequest] = useState<any| null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const assistanceRequestCallback =  useCallback(()=>{
			firebaseApp.db.collection("assistance").add({
				userId: user.uid,
				...assistanceRequest
			}).then(() => {
				console.log("upload success")
				setAssistanceRequest(null)
				setIsUploading(false)
				onCloseAssistance()
			}).catch((error: Error) => {
				console.log(error)
			})
	},[assistanceRequest, onCloseAssistance, firebaseApp, user])

	useEffect((
	) => {
		console.log(assistanceRequest)
		if (assistanceRequest) {
			setIsUploading(true)
			assistanceRequestCallback()
		}
	}, [assistanceRequest, assistanceRequestCallback])

	return (isUploading ?
		<PleaseWaitCircular/>
		:
		<AssistanceFormContext.Provider value={{ openAssistance, onCloseAssistance }}>
			{children(setAssistanceRequest)}
		</AssistanceFormContext.Provider>
	)
}
export default FC