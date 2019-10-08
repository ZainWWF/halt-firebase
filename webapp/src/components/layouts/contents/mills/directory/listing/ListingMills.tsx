
import React, { FunctionComponent, memo, useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';
import { AuthContext } from '../../../../../containers/Main';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MillAdminForm from "../millAdmin/MillAdminForm"
import MillAdminFormModal from "../millAdmin/MillAdminFormModal"
import { Firebase } from '../../../../../providers/Firebase/FirebaseProvider';

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
	mills: any[]
}

const ListView: FunctionComponent<IProps> = memo(({ mills }) => {

	const classes = useStyles();
	const user = useContext(AuthContext)
	const isSuperUser = user!.claims!.superUser;
	const [openMillAdmin, setMillAdmin] = useState(false);
	const [millAdminRef, setMillAdminRef] = useState();

	const onCloseMillAdmin = ()=>{
		setMillAdmin(false)
	}

	const addMillAdmin = (millRef : firebase.firestore.DocumentReference) => {
		setMillAdmin(true)
		setMillAdminRef(millRef)
	}

	console.log("isSuperUser: ", isSuperUser)
	return (
		<>
			<List className={classes.root}>
				{mills.length > 0 ?
					mills.map((mill: any) => {
						return (
							<ListItem key={mill.name}  >
								<ListItemText primary={mill.name} secondary={mill.group ? mill.group : ""} />
								{isSuperUser &&
									<ListItemSecondaryAction onClick={() => addMillAdmin(mill.ref)}>
										<IconButton edge="end" aria-label="add-admin">
											<PersonAddIcon />
										</IconButton>
									</ListItemSecondaryAction>
								}
							</ListItem>
						)
					}) :
					null
				}
			</List>
			<MillAdminForm openMillAdmin={openMillAdmin} onCloseMillAdmin={onCloseMillAdmin} millAdminRef={millAdminRef}>
				{(setNewMillAdmin) => <MillAdminFormModal setNewMillAdmin={setNewMillAdmin} />}
			</MillAdminForm>
		</>
	);

})

export default ListView;