import React, { useContext, Dispatch, SetStateAction, useState, useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TransactionAddTable from "./TransactionAddTable"
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
	openDialog: {
		marginRight: theme.spacing(1),
	},

}));

type Props = {
	setNewTransactionAdd: Dispatch<SetStateAction<any>>
}

export default function ScrollDialog(props: Props) {
	const classes = useStyles();

	const { setNewTransactionAdd } = props
	const [openDialog, setOpenDialog] = useState(false)

	const onCloseDialog = () => {
		setOpenDialog(true)
	}
	
	const onClickOpenDialog= () => {
		setOpenDialog(true)
	}

	return (
		<>
			<Button variant="contained" color="primary" className={classes.openDialog} onClick={onClickOpenDialog}>
				Add Transaction
    </Button>
			<Dialog
				fullWidth={true}
				maxWidth={"sm"}
				open={openDialog}
				onClose={onCloseDialog}
				scroll={"paper"}
				aria-labelledby="scroll-dialog-title"
			>
				<DialogTitle id="scroll-dialog-title">New Transaction</DialogTitle>
				<DialogContent dividers={true}>
					{/* <TransactionAddTable /> */}
				</DialogContent>
				<DialogActions>
					<Button onClick={onCloseDialog} color="primary">
						Cancel
          </Button>
					<Button
						type="submit"
						color="primary"
					// disabled={!isValid && Boolean(touched)}
					>
						Submit
          </Button>
				</DialogActions>
			</Dialog>
		</ >
	);
}