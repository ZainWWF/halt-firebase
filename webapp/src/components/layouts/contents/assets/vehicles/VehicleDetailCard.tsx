import React, { memo, useCallback, useEffect, Dispatch, SetStateAction, FunctionComponent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { VehicleSummary, VehicleDoc } from '../../../../types/Vehicle';

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
		delete: {
			marginLeft: 'auto',
		}
	}),
);

interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	vehicleMoreDetail: VehicleDoc
	setVehicleMoreDetail: Dispatch<SetStateAction<VehicleDoc>>
	vehicleModalDetail: VehicleSummary
	removeVehicleCallback: (path: string) => void
	editVehicleCallback: () => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>
}

const DetailCard: FunctionComponent<IProps> = memo(({ vehicleModalDetail, vehicleMoreDetail, setVehicleMoreDetail, removeVehicleCallback, editVehicleCallback, setViewModalOpen, setHasError }) => {
	const classes = useStyles();

	const detailVehicleCallback = useCallback(() => {
		vehicleModalDetail.ref.get().then((doc) => {
			const result = doc.data() as VehicleDoc
			if (result) {
				setVehicleMoreDetail(result)
			}
		}).catch((error) => {
			setHasError(error)
		})
	}, [vehicleModalDetail, setVehicleMoreDetail, setHasError])

	useEffect(() => {
		detailVehicleCallback();
	}, [detailVehicleCallback])


	const editVehicleOnClick = () => {
		editVehicleCallback()
	}

	const removeVehicleOnClick = () => {
		removeVehicleCallback(vehicleModalDetail.ref.path)
	}

	return ( vehicleMoreDetail &&
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={() => setViewModalOpen(false)}>
						<CloseIcon />
					</IconButton>
				}
				title={`${vehicleMoreDetail.make.type !=="Lainnya" ? vehicleMoreDetail.make.type : vehicleMoreDetail.make.detail} ${vehicleMoreDetail.model}`}
				subheader={vehicleMoreDetail.license}
			/>
			<CardMedia
				className={classes.media}
				image={vehicleMoreDetail.url}
				title="Vehicle"
			/>

				<CardContent>
					<Typography variant="body2" color="textSecondary" component="p">
						colour: {vehicleMoreDetail && vehicleMoreDetail.colour}<br />
						loading capacity: {vehicleMoreDetail && vehicleMoreDetail.loadingCapacity}<br />
					</Typography>
				</CardContent>
			
			<CardActions disableSpacing>
				<IconButton aria-label="edit" onClick={editVehicleOnClick}>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={removeVehicleOnClick} className={classes.delete}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
})

export default DetailCard;