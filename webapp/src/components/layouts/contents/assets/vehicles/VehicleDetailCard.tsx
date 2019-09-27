import React, { memo, FunctionComponent, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { VehicleAssetContext } from '../AssetsContents';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 345,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				height: "100vh",
				width: "100vw"
			},
		},
		media: {
			height: 0,
			paddingTop: '56.25%', // 16:9
		},
		expand: {
			transform: 'rotate(0deg)',
			marginLeft: 'auto',
			transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shortest,
			}),
		},
		expandOpen: {
			transform: 'rotate(180deg)',
		},
		avatar: {
			backgroundColor: red[500],
		},
		delete: {
			marginLeft: 'auto',
		}
	}),
);


const DetailCard: FunctionComponent = memo(() => {
	const classes = useStyles();

	const { stateVehicleAssetContext, dispatchVehicleAssetContext } = useContext(VehicleAssetContext)
	const { selectedVehicleSummaryState } = stateVehicleAssetContext
	const closeVehicleDetailOnClick = () => dispatchVehicleAssetContext({ 
		viewDetail: false ,
		removedVehicleId:"",
		selectedVehicleSummary:{}
	})

	const editVehicleOnClick = () => dispatchVehicleAssetContext({ editDialog: true, viewDetail: false })

	const removeVehicleOnClick = () => {
		const [, vehicleId] = selectedVehicleSummaryState.ref.path.split("/")
		dispatchVehicleAssetContext({ 
			removedVehicleId: vehicleId,
			viewDetail: false 
		 })
	}

	return (selectedVehicleSummaryState &&
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={closeVehicleDetailOnClick}>
						<CloseIcon />
					</IconButton>
				}
				title={`${selectedVehicleSummaryState.make.type !== "Lainnya" ? selectedVehicleSummaryState.make.type : selectedVehicleSummaryState.make.detail} ${selectedVehicleSummaryState.model}`}
				subheader={selectedVehicleSummaryState.license}
			/>
			<CardMedia
				className={classes.media}
				image={selectedVehicleSummaryState.url}
				title="Vehicle"
			/>

			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					colour: {selectedVehicleSummaryState && selectedVehicleSummaryState.colour}<br />
					loading capacity: {selectedVehicleSummaryState && selectedVehicleSummaryState.loadingCapacity}<br />
				</Typography>
			</CardContent>

			<CardActions disableSpacing>
				<IconButton aria-label="edit" onClick={editVehicleOnClick}>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={removeVehicleOnClick} className={classes.delete}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
})

export default DetailCard;