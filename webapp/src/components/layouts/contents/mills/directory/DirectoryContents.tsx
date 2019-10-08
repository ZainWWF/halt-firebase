
import React, { useContext, useEffect, useState, memo } from 'react';
import { Switch, Route, Redirect, } from 'react-router-dom';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import ListingView from "./listing/ListingView"
// import RepsView from "./reps/RepsView"

const Contents = memo(() => {

	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const [mills, setMills] = useState()
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
						return { ...snap.data(), ref: snap.ref }
					})
					setMills(mills)
					setIsRetrieving(false)
				}

			}).catch((error: Error) => {
				console.error(error)
			})
		return () => { isSubscribed = false }
	}, [firebaseApp])

	return (
		<Switch>
			<Redirect exact from="/directory" to={"/directory/listing"} />

			<Route
				path="/directory/listing"
				component={() => <ListingView mills={mills} isRetrieving={isRetrieving} />}
			/>

			{/* <Route
				path="/directory/reps"
				component={RepsView}
			/> */}
		</Switch>
	)

});


export default Contents;
