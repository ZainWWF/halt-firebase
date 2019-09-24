import React, { Dispatch, SetStateAction, FunctionComponent } from 'react';
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
import { PlantationDoc, PlantationSummary, PlantationDetails } from '../../../../types/Plantation';
import { Typography } from '@material-ui/core';

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
		edit: {
			marginLeft: 'auto',
		},
		delete: {
			marginLeft: theme.spacing(1),
		},
		content: {
			backgroundColor: grey[100],
		}
	}),
);

interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	setRepsModalOpen: Dispatch<SetStateAction<boolean>>
	setPlantationDoc: Dispatch<SetStateAction<PlantationDoc | undefined>>
	plantationSummary: PlantationSummary | undefined
	plantationDetails: PlantationDetails | undefined
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void

}

const DetailCard: FunctionComponent<IProps> = ({ plantationSummary, plantationDetails, removePlantationCallback, editPlantationCallback, setViewModalOpen, setMapModalOpen, setRepsModalOpen }) => {
	const classes = useStyles();

	const editPlantationOnClick = ()=>{
		editPlantationCallback(plantationSummary!.ref.path)
	}

	const removePlantationOnClick = ()=>{
		removePlantationCallback(plantationSummary!.ref.path)
	}

	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={() => setViewModalOpen(false)}>
						<CloseIcon />
					</IconButton>
				}
				title={plantationSummary!.name}
				subheader={plantationSummary!.management.type === "PRIVATE" ? "owned by Me" : `owned by ${plantationSummary!.management.name}`}
			/>
			<CardActions >
				<Button size="small" color="primary" onClick={() => { setMapModalOpen(true); setViewModalOpen(false) }}>
					Map
				</Button>
				<Button size="small" color="primary" onClick={() => { setRepsModalOpen(true); setViewModalOpen(false) }}>
					Reps
				</Button>
			</CardActions>
			{plantationDetails &&
				<CardContent className={classes.content}>
					<Typography variant="body2" color="textPrimary" component="p">
						Geolocation
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						latitude: {plantationDetails.geoLocation!.latitude}<br />
						longitude: {plantationDetails.geoLocation!.longitude}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Management
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationDetails.management.type}<br />
						detail: {plantationDetails.management.detail}<br />
						name: {plantationDetails.management.name}<br />
						rep: {plantationDetails.management.rep}<br />
						contact: {plantationDetails.management.contact}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Certification
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationDetails.certification.type}<br />
						detail: {plantationDetails.certification.detail}<br />
						serial: {plantationDetails.certification.serial}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Previous Land Cover
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationDetails.previousLandCover.type}<br />
						detail: {plantationDetails.previousLandCover.detail}<br />
					</Typography>
					{/* <Typography variant="body2" color="textPrimary" component="p">
						Licensed Area
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						size: {`${plantationDetails.license.area} ha`}<br />
						type: {plantationDetails.license.type}<br />
						detail: {plantationDetails.license.detail}<br />
					</Typography> */}
					<Typography variant="body2" color="textSecondary" component="p">
						land clearing method: {plantationDetails.landClearingMethod}<br />
						age: {plantationDetails.age}<br />
						planted: {plantationDetails.treesPlanted}<br />
						productive: {plantationDetails.treesProductive}<br />
						ave. monthly yield: {plantationDetails.aveMonthlyYield}<br />
					</Typography>
				</CardContent>
			}
			<CardActions >
				<IconButton aria-label="edit" onClick={editPlantationOnClick} className={classes.edit}>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={removePlantationOnClick} className={classes.delete}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export default DetailCard;