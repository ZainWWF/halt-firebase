import React, {  FunctionComponent, useContext, useState, useEffect } from 'react';
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
import PlantationRepsCardAddModal from "./PlantationRepsCardAddModal";
import { PlantationAssetContext } from '../AssetsContents';
import { PlantationDoc } from '../../../../types/Plantation';

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

	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedPlantationSummaryState } = statePlantationAssetContext


	const [selectedPlantationDetail, setSelectedPlantationDetail] = useState();

	useEffect(() => {
		selectedPlantationSummaryState.ref.get().then((doc: firebase.firestore.DocumentData) => {
			const result = doc.data() as PlantationDoc
			console.log(result )
			if (result && !doc.metadata.hasPendingWrites)  {
		
				if (result.auditAcceptedAt) {
					setSelectedPlantationDetail({...result.audited, repIds: result.repIds ? result.repIds : []})
				} else {
					setSelectedPlantationDetail({...result.unAudited, repIds: result.repIds ? result.repIds : []})
				}
			}
		}).catch((error: Error) => {
			// setHasError(error)
		})
	}, [selectedPlantationSummaryState])

	
	const closeRepsCardOnClick = () => {
		dispatchPlantationAssetContext({
			viewRep: false,
			viewDetail: true
		})
	}

	const openRepsCardAddModaOnClick = () => {
		dispatchPlantationAssetContext({
			addRep: true
		})

	}


	return (
		<>
			<Card className={classes.card}>
				<CardHeader
					action={
						<IconButton aria-label="settings" onClick={closeRepsCardOnClick}>
							<AssignmentIcon />
						</IconButton>
					}
					title={selectedPlantationSummaryState.name}
					subheader={"Producer Reps"}
				/>
				{
					<CardContent className={classes.content}>
						{selectedPlantationDetail && selectedPlantationDetail.repIds.length > 0 ?
							<PlantationRepsCardList
							plantationReps={selectedPlantationDetail.repIds}
								plantationSummary={selectedPlantationSummaryState}
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
			<PlantationRepsCardAddModal/>
		</>
	);
}

export default DetailCard;