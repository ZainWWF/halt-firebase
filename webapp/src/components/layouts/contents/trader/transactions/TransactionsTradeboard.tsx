import React, { useContext, useEffect, useState, useRef, createContext, FunctionComponent } from 'react';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import { AuthContext } from '../../../../containers/Main';


export const TradeboardContext = createContext<any>(undefined)

type Props = {
	children: any

}
const FC: FunctionComponent<Props> = ({ children }) => {

	const user = useContext(AuthContext) as firebase.User;
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const [tradeboardData, setTradeBoardData] = useState()

	const unsubscribeRef = useRef<any>()
	useEffect(() => {
		console.log("unsubscribe")
		return () => unsubscribeRef.current()
	}, [])

	useEffect(() => {

		console.log("refreshing tradeboard subscription")
		if (unsubscribeRef.current) unsubscribeRef.current()
		console.log("subscribe")
		unsubscribeRef.current = firebaseApp.db
			.collection("tradeboard")
			.doc(user.uid)
			.onSnapshot((doc) => {
				const data = doc.data();
				setTradeBoardData({ ...data, userId: user.uid} )
				console.log(data)
			})

	}, [firebaseApp, user])

	return (

		<TradeboardContext.Provider value={{ tradeboardData }}>
			<>{children()}</>
		</TradeboardContext.Provider>

	)


};

export default FC;
