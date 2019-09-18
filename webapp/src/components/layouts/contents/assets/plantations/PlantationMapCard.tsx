import React, { useState, Dispatch, SetStateAction, FunctionComponent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Button from '@material-ui/core/Button';
import PlantationMap from './PlantationMap';
import { PlantationDoc, PlantationSummary } from '../../../../types/Plantation';

import Typography from '@material-ui/core/Typography';

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


interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	mapModalOpen: boolean
	setPlantationDoc: Dispatch<SetStateAction<PlantationDoc | undefined>>
	plantationSummary: PlantationSummary | undefined
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}

const DetailCard: FunctionComponent<IProps> = ({ plantationSummary, setViewModalOpen, setMapModalOpen, setHasError }) => {
	const classes = useStyles();

	const [canUpload, setCanUpload] = useState(false)


	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={() => { setViewModalOpen(true); setMapModalOpen(false) }}>
						<AssignmentIcon />
					</IconButton>
				}
				title={plantationSummary!.name}
				subheader={plantationSummary!.management.type === "PRIVATE"?  "owned by Me" : `owned by ${plantationSummary!.management.name}` }
			/>
			<CardActions >
				<Button variant="contained" color="primary" className={classes.button} onClick={() => { }} disabled={!canUpload}>
					Upload Geometry
      </Button>

			</CardActions>
			<CardContent>
			<Typography display={"block"} variant={"caption"}>
					drag and drop the Geojson geometry of the plantation into the map.
				</Typography>
				<PlantationMap setHasError={setHasError} setCanUpload={setCanUpload} />
			</CardContent>
		</Card>
	);
}

export default DetailCard;