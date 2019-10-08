import React, { memo, useState, FunctionComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { Theme, Button } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import ListingMills from "./ListingMills"
import PleaseWaitCircular from "../../../../../progress/PleaseWaitCircular"
import MillContactsList from "../millContacts/MillContactList"
import MillContactForm from "../millContacts/MillContactForm"
import MillContactFormModal from "../millContacts/MillContactFormModal"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';


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
	isRetrievingMill: boolean
}

const View: FunctionComponent<IProps> = memo(({ mills, isRetrievingMill }) => {

	const classes = useStyles();

	const [selectedMill, selectMill] = useState()
	const [hasError, setHasError] = useState<Error>();
	const [showError, setShowError] = useState(false);
	const [openMillContact, setMillContact] = useState(false);

	const onCloseMillContact = () => {
		setMillContact(false)

	}

	const addMillContactOnClick = () => {
		setMillContact(true)
	}

	return (
		<Paper className={classes.paper}>
			<AppBar className={classes.topBar} position="static" color="default" elevation={0}>
				<Toolbar>
					<Grid container spacing={2} alignItems="center">
						{Boolean(selectedMill && selectedMill.ref) &&
							<>
								<Grid item>
									<IconButton aria-label="settings"  onClick={()=>selectMill(null)}>
										<ArrowBackIosIcon />
									</IconButton>
								</Grid>
								<Grid item xs>
									<Typography variant="h6" align="left">
										{selectedMill.name}
									</Typography>
								</Grid>
								<Grid item>
									<Button variant="contained" color="primary" className={classes.addUser} onClick={addMillContactOnClick}>
										Add Mill Contacts
									</Button>
								</Grid>
							</>
						}
					</Grid>
				</Toolbar>
			</AppBar>
			{Boolean(selectedMill && selectedMill.ref) ?
				<>
					{!openMillContact && <MillContactsList selectedMillRef={selectedMill ? selectedMill.ref : null} />}
				</>
				:
				<>
					{isRetrievingMill ? <PleaseWaitCircular /> : <ListingMills mills={mills} selectMill={selectMill} />}
				</>
			}
			<MillContactForm openMillContact={openMillContact} onCloseMillContact={onCloseMillContact} millContactRef={selectedMill ? selectedMill.ref : null}>
				{(setNewMillContact) => <MillContactFormModal setNewMillContact={setNewMillContact} />}
			</MillContactForm>
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