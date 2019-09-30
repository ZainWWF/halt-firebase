import React, { useContext, useCallback, useEffect, useState, useRef, createContext, useReducer, Dispatch } from 'react';
import { FirebaseContext, Firebase } from '../../../providers/Firebase/FirebaseProvider';
import { Switch, Route } from 'react-router-dom';
import VehiclesView from './vehicles/VehiclesView';
import PlantationsView from './plantations/PlantationsView';
import { AuthContext } from '../../../containers/Main';

import { initialVehicleState, vehicleAssetContextReducer } from './vehicles/vehicleAssetContext';
import { initialPlantationState, plantationAssetContextReducer, PlantationAssetContextState, PlantationAssetContextAction } from './plantations/plantationAssetContext';
import { PlantationDoc } from '../../../types/Plantation';

export const VehicleAssetContext = createContext<any>(initialVehicleState);

type PlantationContextType = {
	dispatchPlantationAssetContext: Dispatch<PlantationAssetContextAction>,
	statePlantationAssetContext: PlantationAssetContextState
}

export const PlantationAssetContext = createContext<Partial<PlantationContextType>>({});

const AssetsContents = () => {

	const [stateVehicleAssetContext, dispatchVehicleAssetContext] = useReducer(vehicleAssetContextReducer, initialVehicleState);
	const [statePlantationAssetContext, dispatchPlantationAssetContext] = useReducer(plantationAssetContextReducer, initialPlantationState);
	const [vehicleCollection, setVehicleCollection] = useState()
	const [plantationCollection, setPlantationCollection] = useState()
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
					setPlantationCollection(data.plantations)

					dispatchPlantationAssetContext({
						plantationCollection: {
							payload: data.plantations
						}
					})
				}
				if (data && data.vehicles) {
					setVehicleCollection(data.vehicles)
				}
			})

	}, [firebaseApp, user])

	useEffect(() => {
		if(statePlantationAssetContext.plantationDetailRefreshState){
			listenAssetCallback()
		}
		return () => {
			console.log("unsubscribe")
			if (unsubscribeRef) unsubscribeRef.current()
		}
	}, [listenAssetCallback, statePlantationAssetContext.plantationDetailRefreshState])


	useEffect(() => {
		console.log(statePlantationAssetContext.selectedPlantationIdState)
		let isSubscribed = true
		if (plantationCollection && statePlantationAssetContext.selectedPlantationIdState) {
			plantationCollection[statePlantationAssetContext.selectedPlantationIdState].ref.get().then((doc: firebase.firestore.DocumentData) => {
				const result = doc.data() as PlantationDoc
				if (result && isSubscribed) {

					const plantation = result.auditAcceptedAt ? result.audited : result.unAudited
					const plantationDetail = ({
						...plantation,
						repIds: result.repIds ? result.repIds : [],
						name: result.name,
						ref: plantationCollection[statePlantationAssetContext.selectedPlantationIdState!].ref
					})

					Promise.all(plantationDetail.repIds.map((repId: string) =>
						firebaseApp.db.doc(`users/${repId}`)
							.get()))
						.then((snaps: firebase.firestore.DocumentSnapshot[]) => {
							const profiles = snaps.map(snap => { return { ...snap.data()!.profile, userId: snap.id } })
							
							if (isSubscribed) {
								console.log("dispatch plantation details and profile update")
								dispatchPlantationAssetContext({
									selectRepProfiles: {
										payload: profiles
									},
									selectPlantationDetail: {
										payload: plantationDetail
									},
									setPlantationDetailRefresh: {
										payload: false
									}
								})
							}
						})
				}
			}).catch((error: Error) => {
				// setHasError(error)
			})
		}
		return () => {
			isSubscribed = false
		}
		}, [firebaseApp, statePlantationAssetContext.selectedPlantationIdState, plantationCollection])

	// remove plantation 
	useEffect(() => {
		if ( statePlantationAssetContext.removedPlantationIdState  ) {
			const updatePlantationCollection = Object.keys(plantationCollection).reduce((collection, plantationId: string) => {
				if (plantationId !== statePlantationAssetContext.removedPlantationIdState) {
					const plantation = { [plantationId]: plantationCollection[plantationId] }
					return Object.assign({}, collection, plantation)
				}
				return collection
			}, {})

			firebaseApp.db.doc('users/' + user.uid).update({
				plantations: updatePlantationCollection
			}).then(() => {
				console.log("upload success")
				dispatchPlantationAssetContext!({
					setPlantationDetailRefresh: {
						payload: true
					}
				})
			}).catch((error: Error) => {

			})
		}
	}, [firebaseApp,statePlantationAssetContext.removedPlantationIdState, plantationCollection, user])






	return (
		<Switch>
			<Route
				path="/assets/vehicles"
				component={() => {
					return (
						<VehicleAssetContext.Provider value={{ stateVehicleAssetContext, dispatchVehicleAssetContext }}>
							<VehiclesView
								vehicleCollection={vehicleCollection}
							/>
						</VehicleAssetContext.Provider>
					)
				}}
			/>
			<Route
				path="/assets/plantations"
				component={() => {
					return (
						<PlantationAssetContext.Provider value={{ statePlantationAssetContext, dispatchPlantationAssetContext }}>
							<PlantationsView />
						</PlantationAssetContext.Provider>
					)
				}}
			/>
		</Switch>

	);
};

export default AssetsContents;
