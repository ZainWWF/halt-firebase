import React, { memo, useState, FunctionComponent, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { Theme, List } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { TradeboardContext } from "../TransactionsTradeboard"
import { AuthContext } from "../../../../../containers/Main";
import TransactionDetailQuery from "../TransactionDetailQuery"
import TransactionsPendingDetails from "../pending/TransactionsPendingDetails"
import TransactionPendingList from "./TransactionsPendingList"

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
	const [openPendingTransactionDetail, setPendingTransactionDetail] = useState(false);
	const [selectedPendingTransaction, setSelectedPendingTransaction] = useState()

	const getDisplayItems = (transaction: any) => {

		const { userId } = tradeboardData
		const {  sellerId, sellerName, buyerName, error, createdAt, amount, millId, millName, clientType } = transaction

		const transactionType = userId === sellerId ? "Selling" : "Buying"

		let transactionSecondaryLabel = transactionType === "Selling" ? `to ${buyerName}` : `from ${sellerName}`
		console.log(transaction)
		if (millId) {

			transactionSecondaryLabel = transactionType === "Selling" ? `to ${millName} rep, ${buyerName}` : `from ${millName} rep, ${sellerName}`
		}

		if (error) {
			transactionSecondaryLabel = error
		}

		let transactionActionSecondaryAction = `${createdAt.toDate().getDate()}/${createdAt.toDate().getMonth()}`
		return { transactionSecondaryLabel, transactionType, transactionActionSecondaryAction, amount }
	}

	const processTransactionList = (pendings: Record<string, any>) => Object.keys(pendings).map(key => {
		const displayItems = getDisplayItems(pendings[key])
		return { ...pendings[key], id: key, ...displayItems }
	})

	const getPendingTransactionList = () => {
		if (tradeboardData) {
			const { agent, mill } = tradeboardData
			const pendingAgentTransaction = processTransactionList(agent.pending)
			const pendingMillTransaction = processTransactionList(mill.pending)
			return [...pendingAgentTransaction, ...pendingMillTransaction]
		}
		return []
	}
	const pendingTransactionList: Record<string, any>[] = getPendingTransactionList()

	const onClickPendingTransactionDetail = (pendingTransaction: any) => () => {
		setPendingTransactionDetail(true)
		setSelectedPendingTransaction(pendingTransaction)
	}

	const onClosePendingTransactionDetail = () => {
		setPendingTransactionDetail(false)
		setSelectedPendingTransaction(null)
	}

	return (
		<Paper className={classes.paper}>
			<AppBar className={classes.topBar} position="static" color="default" elevation={0}>
				<Toolbar>
					<Grid container spacing={2} alignItems="center">

					</Grid>
				</Toolbar>
			</AppBar>
			<List className={classes.root}>
				{!openPendingTransactionDetail &&
					<TransactionPendingList pendingTransactionList={pendingTransactionList} onClickPendingTransactionDetail={onClickPendingTransactionDetail} />
				}
				{openPendingTransactionDetail &&
					<TransactionDetailQuery selectedPendingTransaction={selectedPendingTransaction} onClosePendingTransactionDetail={onClosePendingTransactionDetail}>
						{(transactionDetail: any, onClosePendingTransactionDetail:any) => <TransactionsPendingDetails transactionDetail={transactionDetail} onClosePendingTransactionDetail={onClosePendingTransactionDetail}/>}
					</TransactionDetailQuery>
				}
			</List>

			{/* {Boolean(pendingTransactionList && pendingTransactionList.ref) ?
				<>
					{!openPendingTransaction && <PendingTransactionsList pendingTransactionListRef={pendingTransactionList ? pendingTransactionList.ref : null} />}
				</>
				:
				<>
					{isRetrieving ? <PleaseWaitCircular /> : <ListingPendingTransactions pendingTransactions={pendingTransactions} selectPendingTransaction={selectPendingTransaction} />}
				</>
			} */}
			{/* <PendingTransactionUpdate openPendingTransaction={openPendingTransaction} onClosePendingTransaction={onClosePendingTransaction} pendingTransactionList={pendingTransactionList ? selectedPendingTransaction : null}>
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




