import React, { useState, useContext, useEffect, useCallback, FunctionComponent } from 'react';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import { Paper, Grid, LinearProgress, Theme, Button, Typography, Toolbar, AppBar, Snackbar} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from '../../../../containers/Main';
import PlantationList from "./PlantationList";
import PlantationsNewDialog from "./PlantationsNewDialog";
import PlantationDetailModal from "./PlantationDetailModal";
import PlantationsEditDialog from "./PlantationsEditDialog";
import PlantationMapModal from "./PlantationMapModal";


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

const View: FunctionComponent = () => {

	const classes = useStyles();

	const [newDialogOpen, setNewDialogOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [mapModalOpen, setMapModalOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [plantationFormData, setPlantationFormData] = useState()
	const [plantationEditData, setPlantationEditData] = useState()
	const [plantationModalDetail, setPlantationModalDetail] = useState()
	const [plantationMoreDetail, setPlantationMoreDetail] = useState()
	const [plantationMap, setPlantationMap] = useState()
	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);
	const [uploadInProgress, setUploadInProgress] = useState(false);

	const user = useContext(AuthContext);
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const newPlantationCallback = useCallback(() => {
		firebaseApp.db.collection('plantations')
			.add({ ...plantationFormData, userId: user.uid })
			.then(() => {
				console.log("upload success")
			}).catch((error) => {
				setHasError(error)
			})
	}, [firebaseApp, user, plantationFormData])

	useEffect(() => {
		if (plantationFormData) {
			newPlantationCallback()
		}
	}, [plantationFormData, newPlantationCallback])


	const removePlantationCallback = useCallback((plantationRef) => {
		setViewModalOpen(false)
		const [, plantationId] = plantationRef.split("/")
		plantationMap.delete(plantationId)
		firebaseApp.db.doc('users/' + user.uid).update({
			plantations: Object.fromEntries(plantationMap)
		}).then(() => {
			setUploadInProgress(false)
		}).catch((error) => {
			setHasError(error)
		})
	}, [plantationMap, firebaseApp, user])


	const editPlantationCallback = useCallback(() => {
		setViewModalOpen(false)
		setEditDialogOpen(true)
		if (plantationEditData) {
			plantationModalDetail.ref.update(plantationEditData)
				.then(() => {
					console.log("update success")
					setEditDialogOpen(false)
					setUploadInProgress(false)
					setPlantationEditData(null)
				}).catch((error: Error) => {
					setHasError(error)
					setEditDialogOpen(false)
					setUploadInProgress(false)
					setPlantationEditData(null)
				})

		}
	}, [plantationEditData, plantationModalDetail])

	useEffect(() => {
		if (plantationEditData) {
			editPlantationCallback()
		}
	}, [plantationEditData, editPlantationCallback])


	const viewPlantationModalCallback = useCallback((e) => {
		const plantationId = e.currentTarget.getAttribute("id")
		setPlantationModalDetail(plantationMap.get(plantationId))
		setViewModalOpen(true)
	}, [plantationMap])


	const listenPlantationCallback = useCallback(() => {
		firebaseApp.db.collection("users").doc(user.uid)
			.onSnapshot((doc) => {
				const data = doc.data();
				if (doc.metadata.hasPendingWrites) {
					setUploadInProgress(true)
				} else {
					setUploadInProgress(false)
				}
				if (data && data.plantations) {
					setPlantationMap(new Map(Object.entries(data.plantations)))
				}
			})
	}, [firebaseApp, user])

	useEffect(() => {
		listenPlantationCallback()
	}, [listenPlantationCallback])

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
								Add Plantation
              </Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			{uploadInProgress ? <LinearProgress /> : null}

			{plantationMap && plantationMap.size > 0 ?
				<PlantationList
					plantationMap={plantationMap}
					viewPlantationModalCallback={viewPlantationModalCallback}
				/>
				:
				<div className={classes.contentWrapper}>
					<Typography color="textSecondary" align="center">
						No plantations registered yet
			</Typography>
				</div>
			}

			<PlantationsNewDialog
				newDialogOpen={newDialogOpen}
				setNewDialogOpen={setNewDialogOpen}
				setPlantationFormData={setPlantationFormData}
				setHasError={setHasError}
				setUploadInProgress={setUploadInProgress}
			/>
			<PlantationsEditDialog
				editDialogOpen={editDialogOpen}
				setEditDialogOpen={setEditDialogOpen}
				setViewModalOpen={setViewModalOpen}
				plantationMoreDetail={plantationMoreDetail}
				setPlantationEditData={setPlantationEditData}
				setHasError={setHasError}
				setUploadInProgress={setUploadInProgress}
			/>
			<PlantationDetailModal
				viewModalOpen={viewModalOpen}
				setViewModalOpen={setViewModalOpen}
				setMapModalOpen={setMapModalOpen}
				plantationModalDetail={plantationModalDetail}
				plantationMoreDetail={plantationMoreDetail}
				setPlantationMoreDetail={setPlantationMoreDetail}
				removePlantationCallback={removePlantationCallback}
				editPlantationCallback={editPlantationCallback}
				setHasError={setHasError}
			/>
			<PlantationMapModal
				setViewModalOpen={setViewModalOpen}
				mapModalOpen={mapModalOpen}
				setMapModalOpen={setMapModalOpen}
				plantationModalDetail={plantationModalDetail}
				plantationMoreDetail={plantationMoreDetail}
				setPlantationMoreDetail={setPlantationMoreDetail}
				removePlantationCallback={removePlantationCallback}
				editPlantationCallback={editPlantationCallback}
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