/**
 * All pages that can be accessed by authenticated user
 * is nested within the Auth Page
 * Unauthenticated and unconfimed user will be routed to the login page
 */
import React, { useState, useEffect, createContext, FunctionComponent } from 'react';
import { Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import LoginPage from '../pages/LoginPage';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { CircularProgress, Grid } from '@material-ui/core';

export const AuthContext = createContext<any>(null);

const Main: FunctionComponent<RouteComponentProps> = ({ location}) => {

	const [showProgress, setShowProgress] = useState(true);
	const [user, setUser] = useState<firebase.User | null>(null)
	const [defaultPath, setDefaultPath] = useState("/assets/plantations")

	useEffect(() => {

		const unsubscribe = firebase.auth().onAuthStateChanged(user => {
			setUser(user);
			setShowProgress(false)
			unsubscribe();
		})
		return () => unsubscribe();
	}, [])

	useEffect(() => {
		localStorage.setItem("path", location.pathname)
	}, [location])

	useEffect(() => {
		const path = localStorage.getItem("path");
		if(path) {
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
					<Switch>
						<Route exact path={defaultPath} component={AuthPage} />
						<Redirect from="/*" to={"/assets/plantations"} />
					</Switch>
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
