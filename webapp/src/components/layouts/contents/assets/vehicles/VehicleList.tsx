import React, { FunctionComponent, MouseEvent } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { VehicleSummary } from '../../../../types/Vehicle';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
		},
		bigAvatar: {
			margin: 10,
			width: 60,
			height: 60,
		},
	}),
);

interface IProps {
	vehicleMap: Record<string, any>
	viewVehicleModalCallback: (e: MouseEvent<HTMLDivElement | MouseEvent>) => void
}

const ListView: FunctionComponent<IProps> = ({ vehicleMap, viewVehicleModalCallback }) => {
	const classes = useStyles();

	return (
		<List className={classes.root}>
			{
				[...vehicleMap.keys()].map((vehicleId: string) => {
					const vehicle: VehicleSummary = vehicleMap.get(vehicleId);
					return (
						<ListItem button key={vehicleId} onClick={viewVehicleModalCallback} id={vehicleId} >
							<ListItemAvatar>
								<Avatar alt={`${vehicle.make.type} ${vehicle.model}/${vehicle.license}`} src={vehicle.url} className={classes.bigAvatar} />
							</ListItemAvatar>
							<ListItemText primary={vehicle.make.type !=="Lainnya" ? vehicle.make.type : vehicle.make.detail} secondary={vehicle.license} />
						</ListItem>
					)
				})
			}
		</List>
	);
}


export default ListView;