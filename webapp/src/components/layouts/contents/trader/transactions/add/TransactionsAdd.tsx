import React, { useState, FunctionComponent } from "react";
import { Button, makeStyles, Theme } from "@material-ui/core";
import TransactionsAddModal from "./TransactionAddModal"
import TransactionAddForm from "./TransactionAddForm"

const useStyles = makeStyles((theme: Theme) => ({
	openDialog: {
		marginRight: theme.spacing(1),
	},

}));

const FC: FunctionComponent = () => {

	const [openDialog , setOpenDialog] = useState(false)
 
	const onCloseDialog = ()=>{
		setOpenDialog(false)
	}

	const onClickOpenDialog= () => {
		setOpenDialog(true)
	}

	const classes = useStyles();

	return (
		<>
			<Button variant="contained" color="primary" className={classes.openDialog} onClick={onClickOpenDialog}>
				Add Transaction
    </Button>
		<TransactionAddForm  openDialog={openDialog} onCloseDialog={onCloseDialog}>
		{(setNewTransactionAdd)=> <TransactionsAddModal setNewTransactionAdd={setNewTransactionAdd}  />}
		</TransactionAddForm>

		</>
	)
}

export default FC