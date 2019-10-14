
import React, { FunctionComponent, memo, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TransactionDetailQuery from "../TransactionDetailQuery";
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
	selectedTransactionId: firebase.firestore.DocumentReference | any
}

const ListView: FunctionComponent<IProps> = memo(({ selectedTransactionId }) => {

	const classes = useStyles();
	const [reload, setReload] = useState(false)


	return (!reload && selectedTransactionId &&
		<>
			<TransactionDetailQuery selectedTransactionId={selectedTransactionId}>
			{(transactionDetail:any)=>{
				return console.log(transactionDetail);
			}	}
			</TransactionDetailQuery>
		</>
		)


})

export default ListView;