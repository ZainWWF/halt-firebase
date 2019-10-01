import React, { useState, FunctionComponent, useContext, memo } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Button from '@material-ui/core/Button';
import PlantationMap from './PlantationMap';
import * as turfHelpers from "@turf/helpers";
import Typography from '@material-ui/core/Typography';
import { PlantationAssetContext } from '../AssetsContents';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 480,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				height: "100vh",
				width: "100vw"
			},
		},
		button: {
			margin: theme.spacing(1),
		},

	}),
);

type IProps = {
	plantationGeometry: string | undefined
	plantationDocRef: firebase.firestore.DocumentReference | undefined
	plantationName: string | undefined
	PlantationManagementType: string | undefined
}

const DetailCard: FunctionComponent<IProps> = memo(({ plantationGeometry, plantationDocRef, plantationName, PlantationManagementType }) => {


	const classes = useStyles();

	const { dispatchPlantationAssetContext } = useContext(PlantationAssetContext)

	const [canUpload, setCanUpload] = useState(false)
	const [newGeometry, setNewGeometry] = useState<turfHelpers.Geometry | null>(null)


	const closePlantationMapOnClick = () => dispatchPlantationAssetContext!({
		setPlantationMapModalOpen: {
			payload: false
		},
		setPlantationDetailsModalOpen: {
			payload: true
		},
		setPlantationDetailRefresh: {
			payload: true
		},		
		selectPlantationDetail: {
			payload: null
		},
	})



	const submitPlantationGeometry = () => {
		plantationDocRef!.update({
			"unAudited.geometry": JSON.stringify(newGeometry)
		})
			.then(() => {
				console.log("upload success")
				setCanUpload(false)

			}).catch((error: Error) => {
				// setHasError(error)
			})
	}

	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={closePlantationMapOnClick}>
						<AssignmentIcon />
					</IconButton>
				}
				title={plantationName}
				subheader={PlantationManagementType === "Pribadi" ? "owned by Me" : `owned by ${plantationName}`}
			/>
			<CardActions >
				<Button variant="contained" color="primary" className={classes.button} onClick={submitPlantationGeometry} disabled={!canUpload}>
					Upload Geometry
      </Button>

			</CardActions>
			<CardContent>
				<Typography display={"block"} variant={"caption"}>
					drag and drop the Geojson geometry of the plantation into the map.
				</Typography>
				<PlantationMap setNewGeometry={setNewGeometry} setCanUpload={setCanUpload} selectedGeometry={plantationGeometry!} />
			</CardContent>
		</Card>
	);
})

export default DetailCard;