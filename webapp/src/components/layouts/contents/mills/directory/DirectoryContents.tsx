
import React, { useContext, useEffect, useState, memo } from 'react';
import { Switch, Route, Redirect, } from 'react-router-dom';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import ListingView from "./listing/ListingView"

const Contents = memo(() => {

	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const [mills, setMills] = useState()
	const [isRetrievingMill, setIsRetrieving] = useState(false)

	useEffect((
	) => {
		let isSubscribed = true
		setIsRetrieving(true)
		firebaseApp.db.collection("mills")
			.get()
			.then((data) => {
				if (isSubscribed) {
					console.log("retrieve done")
					const mills = data.docs.map(snap => {
						return { ...snap.data(), ref: snap.ref }
					})
					setMills(mills)
					setIsRetrieving(false)
				}

			}).catch((error: Error) => {
				console.error(error)
				setIsRetrieving(false)
			})
		return () => { isSubscribed = false }
	}, [firebaseApp])

	return (
		<Switch>
			<Redirect exact from="/directory" to={"/directory/listing"} />

			<Route
				path="/directory/listing"
				component={() => <ListingView mills={mills} isRetrievingMill={isRetrievingMill} />}
			/>

		</Switch>
	)

});


export default Contents;
