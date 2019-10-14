import React, { memo, useState, FunctionComponent, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { Theme, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { TradeboardContext } from "../TransactionsTradeboard"

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
	paper: {
		margin: 'auto',
		overflow: 'hidden',
		borderRadius: 0,
		[theme.breakpoints.up('md')]: {
			maxWidth: 680,
			borderRadius: 10,
			margin: "40px auto"
		},
		[theme.breakpoints.up('lg')]: {
			maxWidth: 936,
			borderRadius: 10,
			margin: "40px auto"
		},
	},
	topBar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchInput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	addUser: {
		marginRight: theme.spacing(1),
	}
}));

const View: FunctionComponent = memo(() => {

	const classes = useStyles();
	const { tradeboardData } = useContext(TradeboardContext)

	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);
	const [openPendingTransaction, setPendingTransaction] = useState(false);


	const getDisplayList = (transaction: any) => {
		const { createdBy, sellerId, sellerName, buyerName, error, createdAt, amount, millId, millName } = transaction
		const transactionType = createdBy === sellerId ? "Selling" : "Buying"

		let transactionSecondaryLabel = transactionType === "Selling" ? `to ${buyerName}` : `from ${sellerName}`

		if(millId){
			transactionSecondaryLabel = transactionType === "Selling" ? `to ${buyerName} of ${millName}` : `from ${sellerName} of ${millName}`
		}

		if (error) {
			transactionSecondaryLabel = error
		}

		let transactionActionSecondaryAction = `${createdAt.toDate().getDate()}/${createdAt.toDate().getMonth()}`
		console.log(transactionActionSecondaryAction)
		return { transactionSecondaryLabel, transactionType, transactionActionSecondaryAction, amount }
	}

	const getPendingTransactions = (pendings: Record<string, any>) => Object.keys(pendings).map(key => {
		const displayList = getDisplayList(pendings[key])
		return { ...pendings[key], id: key, ...displayList }
	})

	const getSelectedPendingTransaction = () => {
		if (tradeboardData) {
			const { agent, mill } = tradeboardData
			const pendingAgentTransaction = getPendingTransactions(agent.pending)
			const pendingMillTransaction = getPendingTransactions(mill.pending)
			return [...pendingAgentTransaction, ...pendingMillTransaction]
		}
	}
	const selectedPendingTransaction = getSelectedPendingTransaction()


	return (
		<Paper className={classes.paper}>
			<AppBar className={classes.topBar} position="static" color="default" elevation={0}>
				<Toolbar>
					<Grid container spacing={2} alignItems="center">

					</Grid>
				</Toolbar>
			</AppBar>
			<List className={classes.root}>
				{
					selectedPendingTransaction &&
					selectedPendingTransaction.map((pendingTransaction: any) => {
						return (
							<ListItem button key={pendingTransaction.id}  >
								<ListItemText primary={pendingTransaction.transactionType} secondary={pendingTransaction.transactionSecondaryLabel} />
								<ListItemSecondaryAction >
									<>
										<span className={classes.amount}>{`${pendingTransaction.amount} kg`}</span>
										<br />
										{pendingTransaction.transactionActionSecondaryAction}
									</>
								</ListItemSecondaryAction>
							</ListItem>
						)
					})
				}
			</List>
			{/* {Boolean(selectedPendingTransaction && selectedPendingTransaction.ref) ?
				<>
					{!openPendingTransaction && <PendingTransactionsList selectedPendingTransactionRef={selectedPendingTransaction ? selectedPendingTransaction.ref : null} />}
				</>
				:
				<>
					{isRetrieving ? <PleaseWaitCircular /> : <ListingPendingTransactions pendingTransactions={pendingTransactions} selectPendingTransaction={selectPendingTransaction} />}
				</>
			} */}
			{/* <PendingTransactionUpdate openPendingTransaction={openPendingTransaction} onClosePendingTransaction={onClosePendingTransaction} selectedPendingTransaction={selectedPendingTransaction ? selectedPendingTransaction : null}>
				{(setNewPendingTransaction) => <PendingTransactionFormModal setNewPendingTransaction={setNewPendingTransaction} />}
			</PendingTransactionUpdate> */}
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				key={`bottom,center`}
				open={showError}
				onClose={() => setShowError(false)}
				autoHideDuration={6000}
				ContentProps={{
					'aria-describedby': 'message-id',
				}}
				message={<span id="message-id">{hasError ? hasError.message : null}</span>}
			/>
		</Paper>

	);
})

export default View;