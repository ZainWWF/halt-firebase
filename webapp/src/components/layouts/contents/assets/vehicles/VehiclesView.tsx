import React, { memo,  useState, useContext, FunctionComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import VehiclesNewDialog from "./VehiclesNewDialog"
import VehiclesEditDialog from "./VehiclesEditDialog"
import VehicleDetailModal from "./VehicleDetailModal";
import Snackbar from '@material-ui/core/Snackbar';
import { LinearProgress, Theme } from '@material-ui/core';
import VehicleList from "./VehicleList";
import { makeStyles } from "@material-ui/core/styles";
import { VehicleAssetContext } from '../AssetsContents';

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
	}
}));

type IProps = {
	vehicleCollection: any
}

const View: FunctionComponent<IProps> = memo(({ vehicleCollection }) => {


	const classes = useStyles();

	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);
	const { dispatchVehicleAssetContext } = useContext(VehicleAssetContext)
	const addVehicleOnClick = () => {
		dispatchVehicleAssetContext({ newDialog: true })
	}

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
							<Button variant="contained" color="primary" className={classes.addUser} onClick={addVehicleOnClick}>
								Add Vehicle
              </Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			{/* {uploadInProgress ? <LinearProgress /> : null} */}
			<VehicleList vehicleCollection={vehicleCollection} />
			<VehiclesNewDialog />
			<VehiclesEditDialog />
			<VehicleDetailModal />
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