import React, { useState, useContext, useEffect, useCallback } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/styles";
import VehiclesNewDialog from "./VehiclesNewDialog"
import VehiclesEditDialog from "./VehiclesEditDialog"
import VehicleDetailModal from "./VehicleDetailModal";
import { AuthContext } from '../../../../containers/Main';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import Snackbar from '@material-ui/core/Snackbar';
import { LinearProgress, Theme } from '@material-ui/core';
import VehicleList from "./VehicleList";
import { UserVehicle } from '../../../../types/UserVehicle';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {

		margin: 'auto',
		overflow: 'hidden',
		borderRadius: 0,
		[theme.breakpoints.up('md')]: {
			maxWidth: 680,
			borderRadius: 10,
			margin: "40px auto"
		},
		[theme.breakpoints.up('lg')]: {
			maxWidth: 936,
			borderRadius: 10,
			margin: "40px auto"
		},
	},
	topBar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchInput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	addUser: {
		marginRight: theme.spacing(1),
	},
	contentWrapper: {
		margin: '40px 16px',
	},
}));

const View = () => {

	const classes = useStyles();

	const [newDialogOpen, setNewDialogOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [vehicleFormData, setVehicleFormData] = useState();
	const [vehicleEditData, setVehicleEditData] = useState();
	const [vehicleModalDetail, setVehicleModalDetail] = useState<UserVehicle>();
	const [vehicleMoreDetail, setVehicleMoreDetail] = useState();
	const [vehicleMap, setVehicleMap] = useState<Record<string, any>>();
	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);
	const [uploadInProgress, setUploadInProgress] = useState(false);

	const user = useContext(AuthContext);
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const newVehicleCallback = useCallback(() => {
		firebaseApp.db.collection('vehicles')
			.add({ ...vehicleFormData, userId: user.uid })
			.then(() => {
				console.log("upload success")
			}).catch((error) => {
				setHasError(error)
			})
	}, [firebaseApp, user, vehicleFormData])

	useEffect(() => {
		if (vehicleFormData) {
			newVehicleCallback()
		}
	}, [vehicleFormData, newVehicleCallback])


	const removeVehicleCallback = useCallback((vehicleRef) => {
		setViewModalOpen(false)
		const [, vehicleId] = vehicleRef.split("/")
		if (vehicleMap) vehicleMap.delete(vehicleId)
		firebaseApp.db.doc('users/' + user.uid).update({
			vehicles: Object.fromEntries(vehicleMap as Iterable<readonly [any]>)
		}).then(() => {
			setUploadInProgress(false)
		}).catch((error) => {
			setHasError(error)
		})
	}, [vehicleMap, firebaseApp, user])


	const editVehicleCallback = useCallback(() => {
		setViewModalOpen(false)
		setEditDialogOpen(true)
		if (vehicleEditData && vehicleModalDetail) {
			vehicleModalDetail.ref.update(vehicleEditData)
				.then(() => {
					console.log("update success")
					setEditDialogOpen(false)
					setUploadInProgress(false)
					setVehicleEditData(null)
				}).catch((error: Error) => {
					setHasError(error)
					setEditDialogOpen(false)
					setUploadInProgress(false)
					setVehicleEditData(null)
				})

		}
	}, [vehicleEditData, vehicleModalDetail])

	useEffect(() => {
		if (vehicleEditData) {
			editVehicleCallback()
		}
	}, [vehicleEditData, editVehicleCallback])


	const viewVehicleModalCallback = useCallback((e) => {
		const vehicleId = e.currentTarget.getAttribute("id")
		if (vehicleMap) setVehicleModalDetail(vehicleMap.get(vehicleId))
		setViewModalOpen(true)
	}, [vehicleMap])


	const listenVehicleCallback = useCallback(() => {
		firebaseApp.db.collection("users").doc(user.uid)
			.onSnapshot((doc) => {
				const data = doc.data();
				if (doc.metadata.hasPendingWrites) {
					setUploadInProgress(true)
				} else {
					setUploadInProgress(false)
				}
				if (data && data.vehicles) {
					setVehicleMap(new Map(Object.entries(data.vehicles)))
				}
			})
	}, [firebaseApp, user])

	useEffect(() => {
		listenVehicleCallback()
	}, [listenVehicleCallback])

	useEffect(() => {
		if (hasError !== undefined) {

			setShowError(true)
			setUploadInProgress(false)
		}
	}, [hasError])

	return (
		<Paper className={classes.paper}>
			<AppBar className={classes.topBar} position="static" color="default" elevation={0}>
				<Toolbar>

					<Grid container spacing={2} alignItems="center">
						<Grid item>
						</Grid>
						<Grid item xs>
						</Grid>
						<Grid item>
							<Button variant="contained" color="primary" className={classes.addUser} onClick={() => setNewDialogOpen(true)}>
								Add Vehicle
              </Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			{uploadInProgress ? <LinearProgress /> : null}

			{vehicleMap && vehicleMap.size > 0 ?
				<VehicleList
					vehicleMap={vehicleMap}
					viewVehicleModalCallback={viewVehicleModalCallback}
				/>
				:
				<div className={classes.contentWrapper}>
					<Typography color="textSecondary" align="center">
						No vehicles registered yet
						</Typography>
				</div>
			}

			<VehiclesNewDialog
				newDialogOpen={newDialogOpen}
				setNewDialogOpen={setNewDialogOpen}
				setVehicleFormData={setVehicleFormData}
				setHasError={setHasError}
				setUploadInProgress={setUploadInProgress}
			/>
			<VehiclesEditDialog
				editDialogOpen={editDialogOpen}
				setEditDialogOpen={setEditDialogOpen}
				setViewModalOpen={setViewModalOpen}
				vehicleMoreDetail={vehicleMoreDetail}
				setVehicleEditData={setVehicleEditData}
				setHasError={setHasError}
				setUploadInProgress={setUploadInProgress}
			/>
			<VehicleDetailModal
				viewModalOpen={viewModalOpen}
				setViewModalOpen={setViewModalOpen}
				vehicleModalDetail={vehicleModalDetail as UserVehicle}
				vehicleMoreDetail={vehicleMoreDetail}
				setVehicleMoreDetail={setVehicleMoreDetail}
				removeVehicleCallback={removeVehicleCallback}
				editVehicleCallback={editVehicleCallback}
				setHasError={setHasError}
			/>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				key={`bottom,center`}
				open={showError}
				onClose={() => setShowError(false)}
				autoHideDuration={6000}
				ContentProps={{
					'aria-describedby': 'message-id',
				}}
				message={<span id="message-id">{hasError ? hasError.message : null}</span>}
			/>
		</Paper>

	);
}

export default View;