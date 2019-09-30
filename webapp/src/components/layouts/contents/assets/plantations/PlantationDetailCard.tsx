import React, { FunctionComponent, useContext} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red, grey } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { PlantationAssetContext } from '../AssetsContents';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 345,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				maxHeight: "100vh",
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
		edit: {
			marginLeft: 'auto',
		},
		delete: {
			marginLeft: theme.spacing(1),
		},
		content: {
			backgroundColor: grey[100],
			overflow: "auto",
			maxHeight: 300,
			[theme.breakpoints.down('xs')]: {
				maxHeight: "100vh",
			},
		}
	}),
);

type IProps = {
	selectedPlantationDetailState: any
}

const DetailCard: FunctionComponent<IProps> = ({ selectedPlantationDetailState }) => {

	const classes = useStyles();
	const {  dispatchPlantationAssetContext } = useContext(PlantationAssetContext)

	const closePlantationDetailOnClick = () => dispatchPlantationAssetContext!({
		setPlantationDetailsModalOpen: {
			payload: false
		},
		selectPlantationId: {
			payload: null
		},
		selectPlantationDetail: {
			payload: null
		},
		selectRepProfiles: {
			payload: null
		}
	})

	const editPlantationDetailOnClick = () => dispatchPlantationAssetContext!({
		setPlantationEditModalOpen: {
			payload: true
		},
		setPlantationDetailsModalOpen: {
			payload: false
		}
	})

	const removePlantationDetailOnClick = () => dispatchPlantationAssetContext!({
		setPlantationDetailsModalOpen: {
			payload: false
		},
		selectPlantationId: {
			payload: null
		},
		selectPlantationDetail: {
			payload: null
		},
		selectRepProfiles: {
			payload: null
		},
		removePlantationId:{
			payload: selectedPlantationDetailState.ref.path.split("/")[1]
		}
	})
	console.log(selectedPlantationDetailState)

	const openMapOnClick = () => dispatchPlantationAssetContext!({
		setPlantationMapModalOpen: {
			payload: true
		},
		setPlantationDetailsModalOpen: {
			payload: false
		}
	})

	return (selectedPlantationDetailState &&
		<>
			<Card className={classes.card} >
				<CardHeader
					action={
						<IconButton aria-label="settings" onClick={closePlantationDetailOnClick}>
							<CloseIcon />
						</IconButton>
					}
					title={selectedPlantationDetailState.name}
					subheader={selectedPlantationDetailState.management!.type === "PRIVATE" ? "owned by Me" : `owned by ${selectedPlantationDetailState!.management.name}`}
				/>
				<CardActions >
					<Button size="small" color="primary" onClick={openMapOnClick}>
						Map
				</Button>
					{/* 
					<Button size="small" color="primary" onClick={openRepOnClick}>
						Reps
				</Button> */}
				</CardActions>

				<CardContent className={classes.content}>
					<Typography variant="body2" color="textPrimary" component="p">
						Geolocation
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						latitude: {selectedPlantationDetailState.geoLocation!.latitude}<br />
						longitude: {selectedPlantationDetailState.geoLocation!.longitude}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Management
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {selectedPlantationDetailState.management.type}<br />
						detail: {selectedPlantationDetailState.management.detail}<br />
						name: {selectedPlantationDetailState.management.name}<br />
						rep: {selectedPlantationDetailState.management.rep}<br />
						contact: {selectedPlantationDetailState.management.contact}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Certification
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {selectedPlantationDetailState.certification.type}<br />
						detail: {selectedPlantationDetailState.certification.detail}<br />
						serial: {selectedPlantationDetailState.certification.serial}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Previous Land Cover
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {selectedPlantationDetailState.previousLandCover.type}<br />
						detail: {selectedPlantationDetailState.previousLandCover.detail}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Licensed Area
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						size: {`${selectedPlantationDetailState.license.area} ha`}<br />
						type: {selectedPlantationDetailState.license.type}<br />
						detail: {selectedPlantationDetailState.license.detail}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Land Clearing Method
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						detail: {selectedPlantationDetailState.landClearingMethod}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Yield
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						age: {selectedPlantationDetailState.age}<br />
						planted: {selectedPlantationDetailState.treesPlanted}<br />
						productive: {selectedPlantationDetailState.treesProductive}<br />
						ave. monthly yield: {selectedPlantationDetailState.aveMonthlyYield}<br />
					</Typography>
				</CardContent>

				<CardActions >
					<IconButton aria-label="edit" onClick={editPlantationDetailOnClick} className={classes.edit}>
						<EditIcon />
					</IconButton>
					<IconButton aria-label="delete" onClick={removePlantationDetailOnClick} className={classes.delete}>
						<DeleteIcon />
					</IconButton>
				</CardActions>
			</Card>

		</>
	);

}


export default DetailCard;