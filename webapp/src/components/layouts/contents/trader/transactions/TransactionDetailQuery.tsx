import React, { FunctionComponent, useState, useEffect, useContext, useCallback } from "react";
import PleaseWaitCircular from "../../../../progress/PleaseWaitCircular"
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';


type Props = {
	children: any
	selectedTransactionId: string
}
const FC: FunctionComponent<Props> = ({ children, selectedTransactionId }) => {

	const [transactionDetail, setTransactionDetail] = useState()
	const [isRetrievingTransactionDetail, setIsRetrievingTransactionDetail] = useState(false)
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const getTransactionDetailCalback = useCallback((
	) => {
		let isSubscribed = true
		setIsRetrievingTransactionDetail(true)
		if (selectedTransactionId) {

			console.log(selectedTransactionId)
			firebaseApp.db.collection("transactions")
				.doc(selectedTransactionId)
				.get()
				.then((transactionSnap) => {
					if (isSubscribed) {
						console.log("retrieve done")
						console.log(transactionSnap.data())
						setTransactionDetail(transactionSnap.data())
						setIsRetrievingTransactionDetail(false)
					}

				}).catch((error: Error) => {
					console.error(error)
					setIsRetrievingTransactionDetail(false)
				})
		}

		return () => { isSubscribed = false }
	}, [selectedTransactionId, firebaseApp])


	useEffect(() => {
		getTransactionDetailCalback()
	}, [getTransactionDetailCalback])


	return (isRetrievingTransactionDetail ?
		<PleaseWaitCircular />
		:
		<>{children(transactionDetail)}</>
	)
}
export default FC