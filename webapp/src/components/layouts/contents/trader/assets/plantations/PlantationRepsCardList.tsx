import React, { FunctionComponent, memo, useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { ListItemSecondaryAction, IconButton } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { PlantationAssetContext } from '../AssetsContents';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
			width: '100%',
		},
		bigAvatar: {
			margin: 10,
			width: 60,
			height: 60,
			backgroundColor: grey[500],

		},
		deleteIcon: {
			top: "55%",
			right: 30
		},
		repList: {
			backgroundColor: "#f5f5f5",
		},

	}),
);

interface IProps {
	plantationSummary: any
	repProfiles: string[]
}


const ListView: FunctionComponent<IProps> = memo(({ plantationSummary, repProfiles }) => {
	
	const classes = useStyles();
	const {   dispatchPlantationAssetContext } = useContext(PlantationAssetContext)

	const removePlantationRep = (userId: string) => {
		plantationSummary!.ref.update({
			"repIds": firebase.firestore.FieldValue.arrayRemove(userId)
		}).then(() => {
			console.log("remove success!")
			dispatchPlantationAssetContext!({
				selectRepProfiles: {
					payload: null
				},
				setPlantationDetailRefresh: {
					payload: true
				},
				setPlantationRepsModalOpen: {
					payload: true
				},
			})
		}).catch((error: Error) => console.log(error))
	}

	return (
		<List className={classes.root}>
			{
				repProfiles! && repProfiles.map((rep: any) => {
					return (
						<ListItem key={rep.userId} id={rep.userId} className={classes.repList}>
							<ListItemAvatar>
								<Avatar alt={""} src={rep.photoUrl} className={classes.bigAvatar}>
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={rep.phoneNumber} secondary={rep.name} />
							<ListItemSecondaryAction className={classes.deleteIcon}>
								<IconButton aria-label="delete" onClick={() => removePlantationRep(rep.userId)} >
									<RemoveCircleOutlineIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					)
				})
			}
		</List>
	);
})

export default ListView;

