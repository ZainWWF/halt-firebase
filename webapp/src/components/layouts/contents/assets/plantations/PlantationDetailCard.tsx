import React, { useCallback, useEffect, Dispatch, SetStateAction, FunctionComponent, useState } from 'react';
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
import { PlantationDoc, Plantation } from '../../../../types/Plantation';

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
	plantationMoreDetail: Omit<PlantationDoc,'audited' | "unAudited">
	setPlantationMoreDetail: Dispatch<SetStateAction<PlantationDoc>>
	plantationModalDetail: UserPlantation
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}

const DetailCard: FunctionComponent<IProps> = ({plantationModalDetail, plantationMoreDetail, setPlantationMoreDetail, removePlantationCallback, editPlantationCallback, setViewModalOpen, setMapModalOpen, setHasError }) =>{
	const classes = useStyles();
	const [ plantationItem, setPlantationItem] = useState<Plantation>()

	const detailPlantationCallback = useCallback(() => {
		plantationModalDetail.ref.get().then((doc) => {
			const result = doc.data() as PlantationDoc
			if (result) {
				console.log(result)
				const {audited, unAudited } = result;
				if(result.auditAcceptedAt){
					setPlantationItem(audited)
				}else{
					setPlantationItem(unAudited)
				}
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
				subheader={!!plantationItem && plantationItem.management.type === "PRIVATE"?  "owned by Me" : `owned by ${!!plantationItem ? plantationItem.management.name : ""} ` }
			/>
			<CardActions >
				<Button size="small" color="primary" className={classes.button} onClick={() => {setMapModalOpen(true); setViewModalOpen(false) }}>
					Map
				</Button>
				<Button size="small" color="primary" className={classes.button}>
					Reps
				</Button>
			</CardActions>
			{plantationItem  &&
				<CardContent className={classes.content}>
					<Typography variant="body2" color="textPrimary" component="p">
						Management
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationItem.management.type}<br />
						other: {plantationItem.management.otherDetails}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Association
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationItem.buyerAssociation.type}<br />
						plasma: {plantationItem.buyerAssociation.plasma}<br />
						mill: {plantationItem.buyerAssociation.mill}<br />
						agreement: {plantationItem.buyerAssociation.agreement}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Certification
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						type: {plantationItem.certification}<br />
					</Typography>
					<Typography variant="body2" color="textPrimary" component="p">
						Plantation
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						area: {plantationItem.area}<br />
						age: {plantationItem.age}<br />
						planted: {plantationItem.treesPlanted}<br />
						productive: {plantationItem.treesProductive}<br />
						ave. monthly yield: {plantationItem.aveMonthlyYield}<br />
						proof of rights: {plantationItem.proofOfRights}<br />
						previous land use: {plantationItem.landPreviousUse}<br />
						land clearing method: {plantationItem.landClearingMethod}<br />
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