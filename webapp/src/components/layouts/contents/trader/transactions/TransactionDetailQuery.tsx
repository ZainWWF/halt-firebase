import React, { FunctionComponent, useState, useEffect, useContext, useCallback } from "react";
import PleaseWaitCircular from "../../../../progress/PleaseWaitCircular"
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';


type Props = {
	children: any
	selectedPendingTransaction: any
}
const FC: FunctionComponent<Props> = ({ children, selectedPendingTransaction }) => {

	const [transactionDetail, setTransactionDetail] = useState()
	const [isRetrievingTransactionDetail, setIsRetrievingTransactionDetail] = useState(false)
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const getTransactionDetailCalback = useCallback((
	) => {
		let isSubscribed = true
		setIsRetrievingTransactionDetail(true)
		if (selectedPendingTransaction) {

			console.log(selectedPendingTransaction)
			firebaseApp.db.collection("transactionsPending")
				.doc(selectedPendingTransaction.id)
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
	}, [selectedPendingTransaction, firebaseApp])


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