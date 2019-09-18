import React, { FunctionComponent, useEffect, useCallback, useContext, useState, memo, Dispatch, SetStateAction } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import { ListItemSecondaryAction, IconButton } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { PlantationSummary } from '../../../../types/Plantation';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

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
	plantationReps: string[] | undefined
	plantationSummary: PlantationSummary | undefined
	setPlantationReps: Dispatch<SetStateAction<string[] | undefined>>
}


const ListView: FunctionComponent<IProps> = memo(({ plantationSummary, plantationReps, setPlantationReps }) => {
	const classes = useStyles();
	const [repProfiles, setRepProfiles] = useState<any[]>([])
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const removePlantationRep = (userId: string) => {
		plantationSummary!.ref.update({
			"repIds": firebase.firestore.FieldValue.arrayRemove(userId)
		}).then(() => {

			if (plantationReps) {
				const updatedPlantationReps = plantationReps.filter(repId => repId !== userId)
				setPlantationReps(updatedPlantationReps)
			}
			console.log("remove success!")
		}).catch(error => console.log(error))
	}

	const plantationRepsCallback = useCallback(() =>
		Promise.all(plantationReps!.map(repId =>
			firebaseApp.db.doc(`users/${repId}`)
				.get()))

		, [plantationReps, firebaseApp])

	useEffect(() => {
		plantationRepsCallback().then((snaps: firebase.firestore.DocumentSnapshot[]) => {
			const profiles = snaps.map(snap => { return { ...snap.data()!.profile, userId: snap.id } })
			console.log(profiles)
			setRepProfiles(profiles)
		})
	}, [plantationRepsCallback])


	return (
		<List className={classes.root}>
			{
				repProfiles!.map((rep: any) => {
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

