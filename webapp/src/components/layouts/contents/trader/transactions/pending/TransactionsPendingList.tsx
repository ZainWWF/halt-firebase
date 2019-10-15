
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { Theme, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
	contentWrapper: {
		margin: '40px 16px',
	},
	amount: {
		fontWeight: 500,
		fontSize: "1.1rem"
	},
}));

type Props = {
	pendingTransactionList: Record<string, any>[]
	onClickPendingTransactionDetail: (p: any) => () => void
}

export default function TransactionPendingList(props: Props) {
	const { pendingTransactionList, onClickPendingTransactionDetail } = props
	const classes = useStyles();

	return (
		<>
			{(pendingTransactionList.map((pendingTransaction: any) =>
				<ListItem button key={pendingTransaction.id} onClick={onClickPendingTransactionDetail(pendingTransaction)}>
					<ListItemText primary={pendingTransaction.transactionType} secondary={pendingTransaction.transactionSecondaryLabel} />
					<ListItemSecondaryAction >
						<>
							<span className={classes.amount}>{`${pendingTransaction.amount} kg`}</span>
							<br />
							{pendingTransaction.transactionActionSecondaryAction}
						</>
					</ListItemSecondaryAction>
				</ListItem>))}
		</>
	)
}