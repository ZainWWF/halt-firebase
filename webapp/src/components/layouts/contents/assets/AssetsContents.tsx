import React, { useContext, useCallback, useEffect, useState, useRef, createContext, useReducer } from 'react';
import { FirebaseContext, Firebase } from '../../../providers/Firebase/FirebaseProvider';
import { Switch, Route } from 'react-router-dom';
import VehiclesView from './vehicles/VehiclesView';
import PlantationsView from './plantations/PlantationsView';
import { AuthContext } from '../../../containers/Main';
import { VehicleSummary, VehicleDoc } from '../../../types/Vehicle';

type AssetContextState = {
	newDialogState: boolean
	editDialogState: boolean
	viewDetailState: boolean
	selectedVehicleSummaryState: Partial<VehicleSummary>
	newVehicleDocState: Partial<VehicleDoc>
	uploadInProgressState: boolean
	removedVehicleIdState: string
}

type AssetContextAction = {
	newDialog: true | false
	editDialog: true | false
	viewDetail: true | false
	uploadInProgress: true | false
	selectedVehicleSummary: {}
	newVehicleDoc: {}
	removedVehicleId: string
}

const newDialogReducer = (state: AssetContextState, action: AssetContextAction) => {

	return Object.keys(action).reduce((state, type) => {

		if (type === "newDialog") {
			return { ...state, newDialogState: action.newDialog }
		}
		if (type === "editDialog") {
			return { ...state, editDialogState: action.editDialog }
		}
		if (type === "viewDetail") {
			return { ...state, viewDetailState: action.viewDetail }
		}
		if (type === "selectedVehicleSummary") {
			return { ...state, selectedVehicleSummaryState: action.selectedVehicleSummary }
		}
		if (type === "newVehicleDoc") {
			return { ...state, newVehicleDocState: action.newVehicleDoc }
		}
		if (type === "uploadInProgress") {
			return { ...state, uploadInProgressState: action.uploadInProgress }
		}
		if (type === "removedVehicleId") {
			return { ...state, removedVehicleIdState: action.removedVehicleId }
		}
		return state

	}, state)
}

const initialState: AssetContextState = {
	newDialogState: false,
	editDialogState: false,
	viewDetailState: false,
	selectedVehicleSummaryState: {},
	newVehicleDocState: {},
	uploadInProgressState: false,
	removedVehicleIdState:  ""
}

export const AssetContext = createContext<any>(initialState);


const AssetsContents = () => {

	const [stateAssetContext, dispatchAssetContext] = useReducer(newDialogReducer, initialState);
	const [vehicleCollection, setVehicleCollection] = useState()
	const user = useContext(AuthContext) as firebase.User;
	const firebaseApp = useContext(FirebaseContext) as Firebase;


	const unsubscribeRef = useRef<any>()

	const listenAssetCallback = useCallback(() => {
		let unsubscribe = firebaseApp.db
			.collection("users")
			.doc(user.uid)
			.onSnapshot((doc) => {
				unsubscribeRef.current = unsubscribe
				const data = doc.data();

				if (data && data.plantations) {

					// setPlantationMap(new Map(Object.entries(data.plantations)))
				}
				if (data && data.vehicles) {

					setVehicleCollection(data.vehicles)

				}
			})

	}, [firebaseApp, user])

	useEffect(() => {
		listenAssetCallback()
		return () => {
			console.log("unsubscribe")
			unsubscribeRef.current()
		}
	}, [listenAssetCallback])

	return (
		<AssetContext.Provider value={{ stateAssetContext, dispatchAssetContext }}>
			<Switch>
				<Route
					path="/assets/vehicles"
					component={() => <VehiclesView vehicleCollection={vehicleCollection} />}
				/>
				{/* <Route
					path="/assets/plantations"
					component={() =>
						<PlantationsView
							plantationFormData={plantationFormData}
							setPlantationFormData={setPlantationFormData}
							uploadInProgress={uploadInProgress}
							setUploadInProgress={setUploadInProgress}
							plantationMap={plantationMap}
						/>}
				/> */}
			</Switch>
		</AssetContext.Provider>
	);
};

export default AssetsContents;
