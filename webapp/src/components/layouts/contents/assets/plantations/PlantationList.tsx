
import React, { FunctionComponent, MouseEvent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';
import classNames from "classnames";

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
		auditedAvatar: {
			color: '#fff',
			backgroundColor: green[500],
		},
		nonAuditedAvatar: {
			color: '#fff',
			backgroundColor: grey[500],
		}
	}),
);

interface IProps {
	plantationMap: Record<string, any>
	viewPlantationSummaryCallback: (e: MouseEvent<HTMLDivElement | MouseEvent>) => void
}

const ListView: FunctionComponent<IProps> = ({ plantationMap, viewPlantationSummaryCallback }) => {
	const classes = useStyles();

	return (
		<List className={classes.root}>
			{
				[...plantationMap.keys()].map((plantationId: any) => {

					const plantation = plantationMap.get(plantationId);

					let ownershipLabel: string

					if (!plantation.repOfId) {
						ownershipLabel = plantation.management.type === "PRIVATE" ? "owned by Me" : `owned by ${plantation.management.name}`
					} else {
						ownershipLabel = plantation.management.type === "PRIVATE" ? `owned by ${plantation.repOfName ? plantation.repOfName : "Unknown"}` : `owned by ${plantation.management.name}`
					}

					return (
						<ListItem button key={plantationId} onClick={viewPlantationSummaryCallback} id={plantationId} >
							<ListItemAvatar>
								<Avatar alt={plantation.name} className={plantation.auditAcceptedAt ? classNames(classes.bigAvatar, classes.auditedAvatar) : classNames(classes.bigAvatar, classes.nonAuditedAvatar)} >
									{plantation.auditAcceptedAt ? <AssignmentTurnedInIcon /> : <AssignmentLateIcon />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={plantation.name} secondary={ownershipLabel} />
						</ListItem>
					)
				})
			}
		</List>
	);
}

export default ListView;