/**
 * Provider for the Sidenav Drawer component
 * Other components calls the API to open or close the drawer
 */
import React, { createContext, useReducer, FunctionComponent } from 'react';

const reducer = (state: DrawerState, action: ReducerAction) => {
	const { type } = action;
	if (type === 'toggle') {
		return { open: !state.open };
	}
	if (type === 'open') {
		return { open: true };
	}
	if (type === 'close') {
		return { open: false };
	}
	return state;
};

type DrawerState = {
	open: boolean;
}

type ReducerAction = {
	type: "toggle" | "open" | "close"
}

const initialState: DrawerState = {
	open: false
};
const SideNavContext = createContext<any>(initialState);

const SideNavProvider: FunctionComponent = ({ children }) => {
	const [stateSideNav, dispatchSideNav] = useReducer(reducer, initialState);
	return (
		<SideNavContext.Provider value={{ stateSideNav, dispatchSideNav }}>
			{children}
		</SideNavContext.Provider>
	);
};

export { SideNavContext, SideNavProvider as default };
