import React, { useCallback, useEffect, Dispatch, SetStateAction, FunctionComponent } from 'react';
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
import { Vehicle } from '../../../../types/Vehicle';
import { UserVehicle } from '../../../../types/UserVehicle';


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
	vehicleMoreDetail: Vehicle
	setVehicleMoreDetail: Dispatch<SetStateAction<Vehicle>>
	vehicleModalDetail: UserVehicle
	removeVehicleCallback: (path: string) => void
	editVehicleCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}

const DetailCard: FunctionComponent<IProps> = ({ vehicleModalDetail, vehicleMoreDetail, setVehicleMoreDetail, removeVehicleCallback, editVehicleCallback, setViewModalOpen, setHasError }) => {
	const classes = useStyles();

	const detailVehicleCallback = useCallback(() => {
		vehicleModalDetail.ref.get().then((doc) => {
			const result = doc.data() as Vehicle
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


	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={() => setViewModalOpen(false)}>
						<CloseIcon />
					</IconButton>
				}
				title={`${vehicleModalDetail.make} ${vehicleModalDetail.model}`}
				subheader={vehicleModalDetail.license}
			/>
			<CardMedia
				className={classes.media}
				image={vehicleModalDetail.url}
				title="Vehicle"
			/>
			{vehicleMoreDetail ?
				<CardContent>
					<Typography variant="body2" color="textSecondary" component="p">
						chassis: {vehicleMoreDetail.chassis}<br />
						colour: {vehicleMoreDetail.colour}<br />
						loading capacity: {vehicleMoreDetail.loadingCapacity}<br />
					</Typography>
				</CardContent>
				: null}
			<CardActions disableSpacing>
				<IconButton aria-label="edit" onClick={() => editVehicleCallback(vehicleModalDetail.ref.path)}>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={() => removeVehicleCallback(vehicleModalDetail.ref.path)} className={classes.delete}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export default DetailCard;