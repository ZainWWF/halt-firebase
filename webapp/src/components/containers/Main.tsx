/**
 * All pages that can be accessed by authenticated user
 * is nested within the Auth Page
 * Unauthenticated and unconfimed user will be routed to the login page
 */
import React, { useState, useEffect, createContext, FunctionComponent, useContext } from 'react';
import { Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import LoginPage from '../pages/LoginPage';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { CircularProgress, Grid } from '@material-ui/core';
import { FirebaseContext, Firebase } from '../providers/Firebase/FirebaseProvider';

export const AuthContext = createContext<firebase.User | null>(null);

const Main: FunctionComponent<RouteComponentProps> = ({ location }) => {

	const [showProgress, setShowProgress] = useState(true);
	const [user, setUser] = useState<firebase.User | null>(null)
	const [defaultPath, setDefaultPath] = useState("/assets/plantations")

	const firebaseApp = useContext(FirebaseContext) as Firebase;



	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged(user => {
			if (user) {
				firebaseApp!.db
					.collection("users")
					.doc(user!.uid)
					.onSnapshot((doc) => {
						const data = doc.data();
						setUser({ ...user, ...data!.profile });
						setShowProgress(false)
					})
			} else {
				setUser(user);
				setShowProgress(false)
				unsubscribe();
			}


		})
		return () => unsubscribe();
	}, [firebaseApp])

	useEffect(() => {
		localStorage.setItem("path", location.pathname)
	}, [location])

	useEffect(() => {
		const path = localStorage.getItem("path");
		if (path) {
			(/^\/$/).test(path) ? setDefaultPath("/assets/plantations") : setDefaultPath(path)
		}
	}, [])

	if (showProgress) {
		return <Grid
			container
			justify="center"
			alignItems="center"
			style={{ height: "100vh" }}
		>
			<CircularProgress />
		</Grid>
	} else {
		if (user) {
			/** user authenticated pages */
			return (
				<AuthContext.Provider value={user}>
					<AuthPage/>
				</AuthContext.Provider>
			)
		} else {
			/** user login and registration pages */
			return (
				<>
					<Switch>
						<Route exact path="/" component={LoginPage} />
						<Redirect from="/*" to="/" />
					</Switch>
				</>
			);
		}
	}
};

export default withRouter(Main);
