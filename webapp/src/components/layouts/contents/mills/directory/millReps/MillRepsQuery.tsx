import React, { FunctionComponent, useState, useEffect } from "react";
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular"

type Props = {
	children: any
	selectedMillRef: firebase.firestore.DocumentReference
}
const FC: FunctionComponent<Props> = ({ children, selectedMillRef }) => {

	const [millReps, setMillReps] = useState<any[] | null>(null)
	const [isRetrievingMillReps, setIsRetrievingMillReps] = useState(false)

	useEffect((
	) => {
		let isSubscribed = true
		setIsRetrievingMillReps(true)
		selectedMillRef.collection("millReps")	
			.get()
			.then((data) => {
				if (isSubscribed) {
					console.log("retrieve done")
					const millReps = data.docs.map(snap => {
						return snap.data()
					})
					setMillReps(millReps)
					setIsRetrievingMillReps(false)
				}
			}).catch((error: Error) => {
				console.error(error)
			})

		return () => { isSubscribed = false }
	}, [selectedMillRef])

	return (isRetrievingMillReps ?
		<PleaseWaitCircular />
		:
		<>{children(millReps)}</>
	)
}
export default FC