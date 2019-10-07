import React, { FunctionComponent, useState, useEffect, useContext } from "react";
import { FirebaseContext, Firebase } from '../../../../../providers/Firebase/FirebaseProvider';
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular"

type Props = {
	children: any
}
const FC: FunctionComponent<Props> = ({ children }) => {
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const [mills, setMills] = useState<any[] | null>(null)
	const [isRetrieving, setIsRetrieving] = useState(true)

	useEffect((
	) => {
		let isSubscribed = true
		firebaseApp.db.collection("mills")
			.get()
			.then((data) => {
				if (isSubscribed) {
					console.log("retrieve done")
					const mills = data.docs.map(snap => {
						return snap.data()
					})
					setMills(mills)
					setIsRetrieving(false)
				}
			}).catch((error: Error) => {
				console.error(error)
			})

		return () => { isSubscribed = false }
	}, [])

	return (isRetrieving ?
		<PleaseWaitCircular />
		:
		<>{children(mills)}</>
	)
}
export default FC