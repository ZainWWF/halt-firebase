import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Main from './Main';
import SideNavProvider from '../providers/SideNav/SideNavProvider';
import FirebaseProvider from "../providers/Firebase/FirebaseProvider";

const App = () => {
	return (
		<FirebaseProvider>
			<Router>
				<SideNavProvider>
					<Main />
				</SideNavProvider>
			</Router>
		</FirebaseProvider>
	);
};

export default App;
