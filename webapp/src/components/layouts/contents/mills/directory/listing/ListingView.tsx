import React, { memo, useState, FunctionComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { Theme } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import ListingQuery from "./ListingQuery"
import ListingMills from "./ListingMills"
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular"


const useStyles = makeStyles((theme: Theme) => ({
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

type IProps = {
	mills: any[]
	isRetrieving: boolean
}

const View: FunctionComponent<IProps> = memo(({ mills, isRetrieving }) => {

	console.log(mills)
	const classes = useStyles();

	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);
	return (
		<Paper className={classes.paper}>
			<AppBar className={classes.topBar} position="static" color="default" elevation={0}>
				<Toolbar>
					<Grid container spacing={2} alignItems="center">
						<Grid item>
						</Grid>
						<Grid item xs>
						</Grid>
						<Grid item>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			{isRetrieving ?
				<PleaseWaitCircular /> : <ListingMills mills={mills}/>
			}
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