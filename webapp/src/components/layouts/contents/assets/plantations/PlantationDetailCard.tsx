import React, { useCallback, useEffect, Dispatch, SetStateAction, FunctionComponent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, grey } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { UserPlantation } from '../../../../types/UserPlantation';
import { Plantation } from '../../../../types/Plantation';

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
		button: {
			// marginLeft: 'auto',
		},
		content: {
			backgroundColor: grey[100],
		}
	}),
);

interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	plantationMoreDetail: Plantation
	setPlantationMoreDetail: Dispatch<SetStateAction<Plantation>>
	plantationModalDetail: UserPlantation
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}

const DetailCard: FunctionComponent<IProps> = ({plantationModalDetail, plantationMoreDetail, setPlantationMoreDetail, removePlantationCallback, editPlantationCallback, setViewModalOpen, setMapModalOpen, setHasError }) =>{
	const classes = useStyles();

	const detailPlantationCallback = useCallback(() => {
		plantationModalDetail.ref.get().then((doc) => {
			const result = doc.data() as Plantation
			if (result) {
				setPlantationMoreDetail(result)
			}
		}).catch((error) => {
			setHasError(error)
		})
	}, [plantationModalDetail, setPlantationMoreDetail, setHasError])

	useEffect(() => {
		detailPlantationCallback();
	}, [detailPlantationCallback])


	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={() => setViewModalOpen(false) }>
						<CloseIcon />
					</IconButton>
				}
				title={plantationModalDetail.name}
				subheader={plantationModalDetail.owner ? `owned by ${plantationModalDetail.owner}` : "owned by Me"}
			/>
			<CardActions >
				<Button size="small" color="primary" className={classes.button} onClick={() => {setMapModalOpen(true); setViewModalOpen(false) }}>
					Map
				</Button>
				<Button size="small" color="primary" className={classes.button}>
					Reps
				</Button>
			</CardActions>
			{plantationMoreDetail &&
				<CardContent className={classes.content}>
					<Typography variant="body2" color="textPrimary" component="p">
						Management
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationMoreDetail.management.type}<br />
						concession company: {plantationMoreDetail.management.concessionCompany}<br />
						other: {plantationMoreDetail.management.otherDetails}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Association
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationMoreDetail.buyerAssociation.type}<br />
						plasma: {plantationMoreDetail.buyerAssociation.plasma}<br />
						mill: {plantationMoreDetail.buyerAssociation.mill}<br />
						agreement: {plantationMoreDetail.buyerAssociation.agreement}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Certification
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationMoreDetail.certification}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Plantation
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						size: {plantationMoreDetail.sizeDeclared}<br />
						age: {plantationMoreDetail.age}<br />
						planted: {plantationMoreDetail.treesPlanted}<br />
						productive: {plantationMoreDetail.treesProductive}<br />
						ave. monthly yield: {plantationMoreDetail.aveMonthlyYield}<br />
						proof of rights: {plantationMoreDetail.proofOfRights}<br />
						previous land use: {plantationMoreDetail.landPreviousUse}<br />
						land clearing method: {plantationMoreDetail.landClearingMethod}<br />
					</Typography>
				</CardContent>
			}
			<CardActions >
				<IconButton aria-label="edit" onClick={() => editPlantationCallback(plantationModalDetail.ref.path)} className={classes.edit}>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={() => removePlantationCallback(plantationModalDetail.ref.path)} className={classes.delete}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export default DetailCard;