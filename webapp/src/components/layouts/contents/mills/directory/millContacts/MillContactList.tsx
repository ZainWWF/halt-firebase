
import React, { FunctionComponent, memo, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MillContactsQuery from "./MillContactsQuery"
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
	selectedMillRef: firebase.firestore.DocumentReference | any
}

const ListView: FunctionComponent<IProps> = memo(({ selectedMillRef }) => {

	const classes = useStyles();
	const [reload, setReload] = useState(false)


	const removeMillContact = (millContactRef: firebase.firestore.DocumentReference) => {
		setReload(true)
		millContactRef.delete()
			.then(() => {
				console.log("deleted")
				setReload(false)
			})
			.catch(e => console.log(e))
	}

	return (!reload && selectedMillRef &&
		<>
			<MillContactsQuery selectedMillRef={selectedMillRef}>
				{(millContacts: Map<number, any>) => {
					console.log(millContacts)
					return (
						<List className={classes.root}>
							{millContacts ?
								Object.values(millContacts).map((millContact: any) => {
									return (
										<ListItem key={millContact.name}  >
											<ListItemText primary={millContact.isAdmin ? `${millContact.name} -  Admin` : millContact.name} secondary={millContact.phoneNumber ? millContact.phoneNumber : ""} />
											<ListItemSecondaryAction onClick={() => removeMillContact(millContact.ref)}>
												<Tooltip title="Remove Mill Contacts">
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
										No mill contact registered yet
									</Typography>
								</div>
							}
						</List>
					)
				}}
			</MillContactsQuery>
		</>
		)


})

export default ListView;