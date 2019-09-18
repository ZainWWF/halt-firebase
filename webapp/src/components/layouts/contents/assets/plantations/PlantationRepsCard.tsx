import React, { Dispatch, SetStateAction, FunctionComponent, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, grey } from '@material-ui/core/colors';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PlantationRepsCardList from "./PlantationRepsCardList";
import PlantationRepsCardAddModal from "./PlantationRepsCardAddModal";
import {  PlantationSummary, PlantationDetails } from '../../../../types/Plantation';

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
		add: {
			marginLeft: 'auto',
		},
		delete: {
			marginLeft: theme.spacing(1),
		},
		button: {
			// marginLeft: 'auto',
		},
		content: {
			backgroundColor: grey[100],
		},
		contentWrapper: {
			margin: '40px 16px',
		},
	}),
);

interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setRepsModalOpen: Dispatch<SetStateAction<boolean>>
	plantationSummary: PlantationSummary | undefined
	plantationDetails: PlantationDetails | undefined
	plantationReps: string[] | undefined
	setPlantationReps: Dispatch<SetStateAction<string[]| undefined>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}

const DetailCard: FunctionComponent<IProps> = ({ setViewModalOpen, setRepsModalOpen, plantationSummary, plantationReps,setPlantationReps, plantationDetails, setHasError }) => {
	const classes = useStyles();
	const [repsAddModalOpen, setRepsAddModalOpen] = useState(false)


	return (
		<>
			<Card className={classes.card}>
				<CardHeader
					action={
						<IconButton aria-label="settings" onClick={() => { setViewModalOpen(true); setRepsModalOpen(false) }}>
							<AssignmentIcon />
						</IconButton>
					}
					title={plantationSummary!.name}
					subheader={"Producer Reps"}
				/>
				{
					<CardContent className={classes.content}>
						{ plantationReps && plantationReps.length > 0 ?
							<PlantationRepsCardList
								plantationReps={plantationReps}
								setPlantationReps={setPlantationReps}
								plantationSummary={plantationSummary}
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
					<IconButton aria-label="add" onClick={() => setRepsAddModalOpen(true)} className={classes.add}>
						<PersonAddIcon />
					</IconButton>
				</CardActions>
			</Card>
			<PlantationRepsCardAddModal
				repsAddModalOpen={repsAddModalOpen}
				setRepsAddModalOpen={setRepsAddModalOpen}
				plantationSummary={plantationSummary}
				setPlantationReps={setPlantationReps}
			/>
		</>
	);
}

export default DetailCard;