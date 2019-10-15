import React, { FunctionComponent, useState, useEffect, createContext, ReactElement, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../containers/Main";
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular";
import { FirebaseContext, Firebase } from '../../../../../providers/Firebase/FirebaseProvider';


export const TransactionAddFormContext = createContext<any>(undefined)

type Props = {
	children: () => ReactElement<any>
	openDialog: any
	onCloseDialog: any
}
const FC: FunctionComponent<Props> = ({ children, openDialog, onCloseDialog }) => {
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const user = useContext(AuthContext) as firebase.User;

	const [newTransactionAdd, setNewTransactionAdd] = useState<any | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [profileData, setProfileData] = useState()


	const getPlantationsCallback = useCallback(() => {
		let isSubscribed = true
		firebaseApp.db.collection("users").doc(user.uid)
			.get()
			.then(profileSnap=>{
				if (isSubscribed) {
					setProfileData(profileSnap.data())
				}
			})
			.catch((error: Error) => {
				console.error(error)
				// setIsRetrievingMillContacts(false)
			})
			return () => { isSubscribed = false }
	}, [firebaseApp, user])

	useEffect(()=>{
		getPlantationsCallback()
	},[getPlantationsCallback])


	const newTransactionAddCallback = useCallback(() => {
		console.log(newTransactionAdd)
		firebaseApp.db.collection("transactionsPending").add({

			...newTransactionAdd
		}).then(() => {
			console.log("upload success")
			setNewTransactionAdd(null)
			setIsUploading(false)
			onCloseDialog()
		}).catch((error: Error) => {
			setIsUploading(false)
			console.log(error)
		})

	}, [newTransactionAdd, onCloseDialog, firebaseApp])

	useEffect((
	) => {
		if (newTransactionAdd) {
			console.log("newTransactionAdd: ",newTransactionAdd)
			setIsUploading(true)
			newTransactionAddCallback()
		}
	}, [newTransactionAdd, newTransactionAddCallback])

	return (isUploading ?
		<PleaseWaitCircular />
		:
		<TransactionAddFormContext.Provider value={{ openDialog, onCloseDialog, profileData, setNewTransactionAdd }}>
			{children()}
		</TransactionAddFormContext.Provider>
	)
}
export default FC