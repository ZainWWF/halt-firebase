import React, { FunctionComponent, MouseEvent, useContext, memo, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { VehicleSummary } from '../../../../types/Vehicle';
import { VehicleAssetContext } from '../AssetsContents';
import { AuthContext } from "../../../../containers/Main";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
		},
		bigAvatar: {
			margin: 10,
			width: 60,
			height: 60,
		},
		contentWrapper: {
			margin: '40px 16px',
		},
	}),
);

type IProps = {
	vehicleCollection: { [key: string]: any }

}

const ListView: FunctionComponent<IProps> = memo(({ vehicleCollection }) => {

	const classes = useStyles();

	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const user = useContext(AuthContext) as firebase.User;
	const { stateVehicleAssetContext, dispatchVehicleAssetContext } = useContext(VehicleAssetContext)
	const { removedVehicleIdState, uploadInProgressState } = stateVehicleAssetContext

	const viewVehicleDetailOnClick = (e: MouseEvent<HTMLDivElement>) => {
		const vehicleId = e.currentTarget.getAttribute("id")
		if (vehicleId) {
			dispatchVehicleAssetContext({
				viewDetail: true,
				selectedVehicleSummary: vehicleCollection[vehicleId]
			})
		}
	}


	// remove vehicle 
	useEffect(() => {
		let isSubscribed = true
		if (removedVehicleIdState.length > 0 && !uploadInProgressState) {
			dispatchVehicleAssetContext({
				uploadInProgress: true,
			})
			const updateVehicleCollection = Object.keys(vehicleCollection).reduce((collection, vehicleId: string) => {
				if (vehicleId !== removedVehicleIdState) {
					const vehicle = { [vehicleId]: vehicleCollection[vehicleId] }
					return Object.assign({}, collection, vehicle)
				}
				return collection
			}, {})

			firebaseApp.db.doc('users/' + user.uid).update({
				vehicles: updateVehicleCollection
			}).then(() => {
				console.log("upload success")
				if (isSubscribed) {
					dispatchVehicleAssetContext({
						uploadInProgress: false,
						removedVehicleId: ""
					})
				}

			}).catch((error: Error) => {

			})
		}
		return () => { isSubscribed = false }
	}, [removedVehicleIdState, firebaseApp, dispatchVehicleAssetContext, user, vehicleCollection, uploadInProgressState])

	return (
		<List className={classes.root}>
			{vehicleCollection ?
				Object.keys(vehicleCollection).map((vehicleId: string) => {
					const vehicle: VehicleSummary = vehicleCollection[vehicleId];
					return (
						<ListItem button key={vehicleId} onClick={viewVehicleDetailOnClick} id={vehicleId} >
							<ListItemAvatar>
								<Avatar alt={`${vehicle.make.type} ${vehicle.model}/${vehicle.license}`} src={vehicle.url} className={classes.bigAvatar} />
							</ListItemAvatar>
							<ListItemText primary={vehicle.make.type !== "Lainnya" ? vehicle.make.type : vehicle.make.detail} secondary={vehicle.license} />
						</ListItem>
					)
				}) :
				<div className={classes.contentWrapper}>
					<Typography color="textSecondary" align="center">
						No vehicles registered yet
				</Typography>
				</div>
			}
		</List>
	);

})


export default ListView;