
import React, { FunctionComponent, memo } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MillRepsQuery from "../millReps/MillRepsQuery"
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';


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


type IProps = {
	selectedMillRef: firebase.firestore.DocumentReference
}

const ListView: FunctionComponent<IProps> = memo(({ selectedMillRef }) => {

	const classes = useStyles();
	
	const removeMillRep = (phoneNumber: string) => {
		console.log(phoneNumber)
	}

	return (
		<>
			<MillRepsQuery selectedMillRef={selectedMillRef}>
				{(millReps: any[]) => {
					return (
						<List className={classes.root}>
							{millReps && millReps.length > 0 ?
								millReps.map((millRep: any) => {
									return (
										<ListItem key={millRep.name}  >
											<ListItemText primary={millRep.name} secondary={millRep.phoneNumber ? millRep.phoneNumber : ""} />
											<ListItemSecondaryAction onClick={() => removeMillRep(millRep.phoneNumber)}>
												<Tooltip title="Remove Mill Reps">
													<IconButton edge="end" aria-label="remove-reps">
														<HighlightOffIcon />
													</IconButton>
												</Tooltip>
											</ListItemSecondaryAction>
										</ListItem>
									)
								}) :
								<div className={classes.contentWrapper}>
									<Typography color="textSecondary" align="center">
										No mill reps registered yet
									</Typography>
								</div>
							}
						</List>
					)
				}}
			</MillRepsQuery>
		</>
	);

})

export default ListView;