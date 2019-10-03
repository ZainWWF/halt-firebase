import React, { useContext, useEffect, useState, useRef, createContext, useReducer, Dispatch, FunctionComponent, useCallback } from 'react';
import { FirebaseContext, Firebase } from '../../../providers/Firebase/FirebaseProvider';
import { Switch, Route } from 'react-router-dom';
import VehiclesView from './vehicles/VehiclesView';
import PlantationsView from './plantations/PlantationsView';
import PlantationMapCard from './plantations/PlantationMapCard';
import PlantationDetailCard from './plantations/PlantationDetailCard';
import PlantationRepsView from './plantations/PlantationsRepsView';
import { withRouter } from 'react-router-dom'
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


type IProps = {
	history: any
	location: any
}

const AssetsContents: FunctionComponent<IProps> = ({ history, location }) => {

	const [stateVehicleAssetContext, dispatchVehicleAssetContext] = useReducer(vehicleAssetContextReducer, initialVehicleState);
	const [statePlantationAssetContext, dispatchPlantationAssetContext] = useReducer(plantationAssetContextReducer, initialPlantationState);
	const [vehicleCollection, setVehicleCollection] = useState()
	const [plantationCollection, setPlantationCollection] = useState()
	const user = useContext(AuthContext) as firebase.User;
	const firebaseApp = useContext(FirebaseContext) as Firebase;


	const reloadCallback = useCallback(() => {
		if (location.pathname) {
			const path = /^.+\/(map|reps)\/(.*)/.exec(location.pathname) as string[]
			if (path) {
				const [, route, id] = path
				if (route === "map" || route === "reps") {
					dispatchPlantationAssetContext!({
						selectPlantationId: {
							payload: id
						}
					})
				}
			}
		}
	}, [location.pathname])

	useEffect(() => {
		reloadCallback()
	}, [reloadCallback])


	const unsubscribeRef = useRef<any>()
	useEffect(() => {
		console.log("unsubscribe")
		return () => unsubscribeRef.current()
	}, [])

	useEffect(() => {
		if (statePlantationAssetContext.plantationDetailRefreshState) {
			console.log("refreshing collection subscription")
			if (unsubscribeRef.current) unsubscribeRef.current()
			console.log("subscribe")
			unsubscribeRef.current = firebaseApp.db
				.collection("users")
				.doc(user.uid)
				.onSnapshot((doc) => {
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
		}
	}, [statePlantationAssetContext.plantationDetailRefreshState, firebaseApp, user])


	// process the selected plantation details to the views
	useEffect(() => {
		let isSubscribed = true
		if (plantationCollection && statePlantationAssetContext.selectedPlantationIdState &&
			plantationCollection[statePlantationAssetContext.selectedPlantationIdState]
		) {
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
		return () => { isSubscribed = false }
	}, [firebaseApp, statePlantationAssetContext.selectedPlantationIdState, plantationCollection])

	// remove plantation 
	useEffect(() => {
		if (statePlantationAssetContext.removedPlantationIdState) {
			console.log("removing plantation Id: ", statePlantationAssetContext.removedPlantationIdState)
			const updatePlantationCollection = Object.keys(plantationCollection).reduce((collection, plantationId: string) => {
				if (plantationId !== statePlantationAssetContext.removedPlantationIdState) {
					const plantation = { [plantationId]: plantationCollection[plantationId] }
					return Object.assign({}, collection, plantation)
				}
				return collection
			}, {})

			console.log("updating plantation collection  with removed plantation to firestore: ", updatePlantationCollection)

			firebaseApp.db.doc('users/' + user.uid).update({
				plantations: updatePlantationCollection
			}).then(() => {
				console.log("upload success")
				dispatchPlantationAssetContext!({
					removePlantationId: {
						payload: null
					}
				})
				history.push("/assets/plantations")
			}).catch((error: Error) => {

			})
		}
	}, [firebaseApp, statePlantationAssetContext.removedPlantationIdState, plantationCollection, user, history])


	return (
		<>
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
			</Switch>

			<PlantationAssetContext.Provider value={{ statePlantationAssetContext, dispatchPlantationAssetContext }}>
				<Switch>
					<Route
						path="/assets/plantations/detail/:id"
						component={PlantationDetailCard}
					/>
					<Route
						path="/assets/plantations/map/:id"
						component={PlantationMapCard}
					/>
					<Route
						path="/assets/plantations/reps/:id"
						component={PlantationRepsView}
					/>
					<Route
						path="/assets/plantations"
						component={PlantationsView}
					/>
				</Switch>
			</PlantationAssetContext.Provider>
		</>
	);
};

export default withRouter(AssetsContents);
