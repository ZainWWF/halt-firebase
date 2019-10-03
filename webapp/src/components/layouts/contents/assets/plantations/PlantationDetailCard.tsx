import React, { FunctionComponent, useContext, useEffect, useState, useCallback } from 'react';
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
import { Typography, LinearProgress } from '@material-ui/core';
import { PlantationAssetContext } from '../AssetsContents';
import PlantationsEditModal from "./PlantationsEditModal";
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';


const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
	<RouterLink innerRef={ref}  {...props} />
));

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 345,
			maxWidth: 680,
			margin: "auto",
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
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
			[theme.breakpoints.down('xs')]: {
				maxHeight: "100vh",
			},
		}
	}),
);

type IProps = {
	match: any
}

const DetailCard: FunctionComponent<IProps> = ({ match }) => {

	const classes = useStyles();
	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedPlantationDetailState } = statePlantationAssetContext!

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		let timer = setTimeout(() => {
			setIsLoading(true)
		}, 500)
		return () => clearTimeout(timer)
	}, [])


	const dispatchCallback = useCallback(() => {
		dispatchPlantationAssetContext!({
			selectPlantationId: {
				payload: match.params.id
			},
		})
	}, [dispatchPlantationAssetContext, match.params.id])

	useEffect(() => {
		dispatchCallback()
	}, [dispatchCallback])


	const editPlantationDetailOnClick = () => dispatchPlantationAssetContext!({
		setPlantationEditModalOpen: {
			payload: true
		},
	})

	const removePlantationDetailOnClick = () => dispatchPlantationAssetContext!({
		selectPlantationId: {
			payload: null
		},
		selectPlantationDetail: {
			payload: null
		},
		selectRepProfiles: {
			payload: null
		},
		removePlantationId: {
			payload: selectedPlantationDetailState!.ref!.path.split("/")[1]
		}
	})


	return (isLoading && selectedPlantationDetailState && Object.keys(selectedPlantationDetailState).length > 0 ?
		<>
			<Card className={classes.card} >
				<CardHeader
					action={
						<IconButton aria-label="close" component={Link} to="/assets/plantations" className={classes.delete}>
							<CloseIcon />
						</IconButton>
					}
					title={selectedPlantationDetailState.name}
					subheader={selectedPlantationDetailState.management!.type === "Pribadi" ? "owned by Me" : `owned by ${selectedPlantationDetailState.management!.name}`}
				/>
				<CardActions >
					<Button size="small" color="primary" component={Link} to={`/assets/plantations/map/${match.params.id}`}>
						Map
				</Button>
					<Button size="small" color="primary" component={Link} to={`/assets/plantations/reps/${match.params.id}`}>
						Reps
				</Button>
					<IconButton aria-label="edit" onClick={editPlantationDetailOnClick} className={classes.edit}>
						<EditIcon />
					</IconButton>
					<IconButton aria-label="delete" onClick={removePlantationDetailOnClick} className={classes.delete}>
						<DeleteIcon />
					</IconButton>
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
						type: {selectedPlantationDetailState.management!.type}<br />
						detail: {selectedPlantationDetailState.management!.detail}<br />
						name: {selectedPlantationDetailState.management!.name}<br />
						rep: {selectedPlantationDetailState.management!.rep}<br />
						contact: {selectedPlantationDetailState.management!.contact}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Certification
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {selectedPlantationDetailState.certification!.type}<br />
						detail: {selectedPlantationDetailState.certification!.detail}<br />
						serial: {selectedPlantationDetailState.certification!.serial}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Previous Land Cover
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {selectedPlantationDetailState.previousLandCover!.type}<br />
						detail: {selectedPlantationDetailState.previousLandCover!.detail}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Licensed Area
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						size: {`${selectedPlantationDetailState.license!.area} ha`}<br />
						type: {selectedPlantationDetailState.license!.type}<br />
						detail: {selectedPlantationDetailState.license!.detail}<br />
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
				<PlantationsEditModal />
			</Card>
		</>
		:
		<LinearProgress />
	);

}


export default DetailCard;