/**
 * this provider is to store the last state of the content selection
 * thus when user return to the page the last selected content is shown
 */
import React, { createContext, FunctionComponent } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import firebaseConfig from "../../../config/firebase.config"

export class Firebase {

	auth: firebase.auth.Auth;
	storage: firebase.storage.Storage;
	db: firebase.firestore.Firestore;
	app: firebase.app.App;

	constructor() {
		this.app = firebase.initializeApp(firebaseConfig);
		this.auth = firebase.auth()
		this.storage = firebase.storage()
		this.db = firebase.firestore()
		this.auth.useDeviceLanguage();
	}
}


const FirebaseContext = createContext<Firebase | undefined>(undefined);

const FirebaseProvider: FunctionComponent = ({ children }) => {

	return (
		<FirebaseContext.Provider value={new Firebase()}>
			{children}
		</FirebaseContext.Provider>
	);
};

export { FirebaseContext, FirebaseProvider as default };
