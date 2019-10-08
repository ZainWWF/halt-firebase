
import React, { FunctionComponent, memo, useContext, useState, Dispatch, SetStateAction } from 'react';
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
import Tooltip from '@material-ui/core/Tooltip';



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
	selectMill: Dispatch<SetStateAction<any>>
}

const ListView: FunctionComponent<IProps> = memo(({ mills, selectMill }) => {

	const classes = useStyles();
	const user = useContext(AuthContext)
	const isSuperUser = user!.claims!.superUser;
	const [openMillAdmin, setMillAdmin] = useState(false);
	const [millAdminRef, setMillAdminRef] = useState();

	const onCloseMillAdmin = () => {
		setMillAdmin(false)
	}

	const addMillAdmin = (millRef: firebase.firestore.DocumentReference) => {
		setMillAdmin(true)
		setMillAdminRef(millRef)
	}

	const onClickMill = (mill: any) => {
		selectMill(mill)
	}
	
	return (
		<>
			<List className={classes.root}>
				{mills && mills.length > 0 ?
					mills.map((mill: any) => {
						return (
							<ListItem button key={mill.name}  onClick={()=>onClickMill(mill)}>
								<ListItemText primary={mill.name} secondary={mill.group ? mill.group : ""} />
								{isSuperUser &&
									<ListItemSecondaryAction onClick={() => addMillAdmin(mill.ref)}>
										<Tooltip title="Add Mill Admin">
											<IconButton edge="end" aria-label="add-admin">
												<PersonAddIcon />
											</IconButton>
										</Tooltip>
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