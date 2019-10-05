import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, Dispatch, SetStateAction, useContext, useCallback } from "react";
import { FirebaseContext, Firebase } from '../../../providers/Firebase/FirebaseProvider';
import { AuthContext } from "../../../containers/Main";
import { CircularProgress, Dialog, DialogTitle, DialogContent } from "@material-ui/core";

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
		<Dialog
			maxWidth={"sm"}
			open={true}
			aria-labelledby="wait-in-progress"
		>
			<DialogTitle >Please Wait...</DialogTitle>
			<DialogContent dividers={true}>
				<div style={{ margin: "20px 55px", padding: 20, width: "50%" }}>
					<CircularProgress />
				</div>
			</DialogContent>
		</Dialog>
		:
		<AssistanceFormContext.Provider value={{ openAssistance, onCloseAssistance }}>
			{children(setAssistanceRequest)}
		</AssistanceFormContext.Provider>
	)
}
export default FC