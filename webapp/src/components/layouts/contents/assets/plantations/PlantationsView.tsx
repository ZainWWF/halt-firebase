import React, { useState, FunctionComponent, memo, useContext } from 'react';
import { Paper, Grid, Theme, Button, Toolbar, AppBar, Snackbar, LinearProgress } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import PlantationList from "./PlantationList";
import PlantationsNewModal from "./PlantationsNewModal";
import PlantationDetailModal from "./PlantationDetailModal";
import PlantationsEditModal from "./PlantationsEditModal";
import PlantationMapModal from "./PlantationMapModal";
import PlantationRepsModal from "./PlantationRepsModal";
import PlantationRepsCardAddModal from "./PlantationRepsCardAddModal";
import PlantationInProgressModal from "./PlantationInProgressModal";
import { PlantationAssetContext } from '../AssetsContents';


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
	addUser: {
		marginRight: theme.spacing(1),
	},
	contentWrapper: {
		margin: '40px 16px',
	},
}));


const View: FunctionComponent = memo(() => {


	const classes = useStyles();

	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);

	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)

	const addPlantationOnClick = () => {
		dispatchPlantationAssetContext!({
			setPlantationNewModalOpen: {
				payload: true
			}
		})
	}

	return (
		<Paper className={classes.paper}>
			<AppBar className={classes.topBar} position="static" color="default" elevation={0}>
				{/* {statePlantationAssetContext!.plantationDetailRefreshState! && <LinearProgress />} */}
				<Toolbar>
					<Grid container spacing={2} alignItems="center">
						<Grid item>
						</Grid>
						<Grid item xs>
						</Grid>
						<Grid item>
							<Button variant="contained" color="primary" className={classes.addUser} onClick={addPlantationOnClick}>
								Add Plantation
              </Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<PlantationList />
			<PlantationsNewModal />
			<PlantationsEditModal />
			{!statePlantationAssetContext!.plantationDetailRefreshState! &&
				<>
					<PlantationDetailModal />
					<PlantationMapModal />
					<PlantationRepsModal />
					<PlantationRepsCardAddModal />
				</>
				// :
				// <PlantationInProgressModal />
			}
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
})

export default View;