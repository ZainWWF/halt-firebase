
import React, { FunctionComponent, MouseEvent, memo, useContext } from 'react';
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
import { PlantationAssetContext } from '../AssetsContents';
import { Typography } from '@material-ui/core';
import { PlantationSummary } from '../../../../types/Plantation';

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
		contentWrapper: {
			margin: '40px 16px',
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

const ListView: FunctionComponent = memo(() => {

	const classes = useStyles();

	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { plantationCollectionState } = statePlantationAssetContext!

	const viewPlantationDetailOnClick = (e: MouseEvent<HTMLDivElement>) => {
		const plantationId = e.currentTarget.getAttribute("id")
		if (plantationId) {
			dispatchPlantationAssetContext!({
				setPlantationDetailsModalOpen: {
					payload: true
				},
				selectPlantationId: {
					payload: plantationId
				}
			})
		}
	}

	const ownership = (plantation: PlantationSummary) => {
		if (!plantation.repOfId) {
			return plantation.management.type === "Pribadi" ? "owned by Me" : `owned by ${plantation.management.name}`
		} else {
			return plantation.management.type === "Pribadi" ? `owned by ${plantation.repOfName ? plantation.repOfName : "Unknown"}` : `owned by ${plantation.management.name}`
		}
	}


	return (
		<List className={classes.root}>
			{plantationCollectionState && Object.keys(plantationCollectionState).length > 0 ?
				Object.keys(plantationCollectionState).map((plantationId: string) => {
					const plantation: PlantationSummary = plantationCollectionState[plantationId];
					return (
						<ListItem button key={plantationId} onClick={viewPlantationDetailOnClick} id={plantationId} >
							<ListItemAvatar>
								<Avatar alt={plantation.name} className={plantation.auditAcceptedAt ? classNames(classes.bigAvatar, classes.auditedAvatar) : classNames(classes.bigAvatar, classes.nonAuditedAvatar)} >
									{plantation.auditAcceptedAt ? <AssignmentTurnedInIcon /> : <AssignmentLateIcon />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={plantation.name} secondary={ownership(plantation)} />
						</ListItem>
					)
				}) :
				<div className={classes.contentWrapper}>
					<Typography color="textSecondary" align="center">
						No plantations registered yet
				</Typography>
				</div>
			}
		</List>
	);

})

export default ListView;