import React, { FunctionComponent, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PlantationRepsCardList from "./PlantationRepsCardList";
import { PlantationAssetContext } from '../AssetsContents';


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
		add: {
			marginLeft: 'auto',
		},
		content: {
			backgroundColor: grey[100],
		},
		contentWrapper: {
			margin: '40px 16px',
		},
	}),
);

const DetailCard: FunctionComponent = () => {

	const classes = useStyles();
	const {  statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedRepProfilesState, selectedPlantationDetailState } = statePlantationAssetContext!

	const closeRepsCardOnClick = () => dispatchPlantationAssetContext!({
		setPlantationRepsModalOpen: {
			payload: false
		},
		setPlantationDetailsModalOpen: {
			payload: true
		}
	})

	const openRepsCardAddModaOnClick = () =>  dispatchPlantationAssetContext!({
		setPlantationNewRepModalOpen: {
			payload: true
		},
		setPlantationRepsModalOpen: {
			payload: false
		}
	})

	return (
		<>
			<Card className={classes.card}>
				<CardHeader
					action={
						<IconButton aria-label="settings" onClick={closeRepsCardOnClick}>
							<AssignmentIcon />
						</IconButton>
					}
					title={selectedPlantationDetailState!.name!}
					subheader={"Producer Reps"}
				/>
				{
					<CardContent className={classes.content}>
						{selectedPlantationDetailState && selectedPlantationDetailState!.repIds!.length > 0 ?
							
							<PlantationRepsCardList
								plantationSummary={selectedPlantationDetailState!}
								repProfiles={selectedRepProfilesState!}
							/>
							:
							<div className={classes.contentWrapper}>
								<Typography color="textSecondary" align="center">
									No plantations reps registered yet
						</Typography>
							</div>
						}

					</CardContent>
				}
				<CardActions >
					<IconButton aria-label="add" onClick={openRepsCardAddModaOnClick} className={classes.add}>
						<PersonAddIcon />
					</IconButton>
				</CardActions>
			</Card>

		</>
	);
}

export default DetailCard;