import React, { useContext, useCallback, useEffect, useState, useRef, createContext, useReducer } from 'react';
import { FirebaseContext, Firebase } from '../../../providers/Firebase/FirebaseProvider';
import { Switch, Route } from 'react-router-dom';
import VehiclesView from './vehicles/VehiclesView';
import PlantationsView from './plantations/PlantationsView';
import { AuthContext } from '../../../containers/Main';

import { initialVehicleState, vehicleAssetContextReducer } from './vehicles/vehicleAssetContext';

export const VehicleAssetContext = createContext<any>(initialVehicleState);


const AssetsContents = () => {

	const [stateVehicleAssetContext, dispatchVehicleAssetContext] = useReducer(vehicleAssetContextReducer, initialVehicleState);
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

		<Switch>

			<Route
				path="/assets/vehicles"
				component={() => {
					return (
						<VehicleAssetContext.Provider value={{ stateVehicleAssetContext, dispatchVehicleAssetContext }}>
							<VehiclesView vehicleCollection={vehicleCollection} />
						</VehicleAssetContext.Provider>
					)
				}}
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

	);
};

export default AssetsContents;
