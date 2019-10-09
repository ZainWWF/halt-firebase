import React from "react";
import { Typography, Grid, AppBar, Toolbar, Theme } from "@material-ui/core";
import TransactionsNavTabs from "./TransactionsNavTabs";
import { makeStyles } from "@material-ui/core/styles";
import TransactionsAdd from "../../../contents/trader/transactions/add/TransactionsAdd"



const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
		color: "#fff",
		backgroundColor: "#384954"
	},
	label: {
		fontSize: ".8em",
		fontWeight: 400
	},
	value: {
		fontSize: "1.45em",
		fontWeight: 400,
		width: 100
	},
	title: {
		fontSize: "2em",
		lineHeight: 1,
		marginLeft: "18px",
		fontWeight: 300,
		letterSpacing: "-0.01562em"
	},
	toolbar:{
		backgroundColor: theme.palette.common.white
	}
}));


const TopBar = () => {

	const classes = useStyles();
	return (
		<Grid container direction="column" justify="space-between">
			<div className={classes.root}>
				<Grid container justify="space-between">
					<Grid item>
						<Typography className={classes.title} color="inherit">
							Trader Transactions
						</Typography>
					</Grid>
					<Grid item>
					</Grid>
					<Grid item>
					</Grid>
				</Grid>
				<AppBar
					component="div"
					color="primary"
					position="static"
					elevation={0}
				>
					<TransactionsNavTabs />
					<Toolbar className={classes.toolbar}>
						<Grid container spacing={2} alignItems="center">
							<Grid item>
							</Grid>
							<Grid item xs>
							</Grid>
							<Grid item>
								<TransactionsAdd />
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
			</div>
		</Grid>
	)
}


export default TopBar;
