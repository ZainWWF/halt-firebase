import React, { useState, FunctionComponent, useContext } from 'react';
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
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 345,
			maxWidth: 680,
			margin: "auto",
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				height: "100vh",
				width: "100vw"
			},
		},
		button: {
			margin: "auto",
		},
		content:{
			padding : 40,
			backgroundColor: "#f5f5f5",
		}

	}),
);

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
	<RouterLink innerRef={ref}  {...props} />
));

type IProps = {
	match : any
}

const DetailCard: FunctionComponent<IProps> = ({match}) => {

	const classes = useStyles();

	const { statePlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedPlantationDetailState } = statePlantationAssetContext!

	const plantationGeometry= selectedPlantationDetailState!.geometry;
	const plantationDocRef= selectedPlantationDetailState!.ref;
	const plantationName= selectedPlantationDetailState!.name;
	const PlantationManagementType = selectedPlantationDetailState!.management ? selectedPlantationDetailState!.management!.type : null

	const [canUpload, setCanUpload] = useState(false)
	const [newGeometry, setNewGeometry] = useState<turfHelpers.Geometry | null>(null)


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
					<IconButton aria-label="settings" component={Link} to={`/assets/plantations/detail/${match.params.id}`}>
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
			<CardContent className={classes.content}>
				<Typography display={"block"} variant={"caption"} align={"center"}>
					drag and drop the Geojson geometry of the plantation into the map.
				</Typography>
				<PlantationMap setNewGeometry={setNewGeometry} setCanUpload={setCanUpload} selectedGeometry={plantationGeometry!} />
			</CardContent>
		</Card>
	);
}

export default DetailCard;