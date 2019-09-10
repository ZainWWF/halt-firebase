/**
 *  Login Page
 */

import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import {
	withWidth,
	Container,
} from "@material-ui/core";
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { Grid } from "@material-ui/core";
import LoginForm from "../layouts/contents/user/LoginForm";
import theme from "../../config/theme.config";
import SMSVerificationForm from "../layouts/contents/user/SMSVerificationForm";
import * as firebase from "firebase/app";
import "firebase/auth";
import { makeStyles } from "@material-ui/core/styles";
import { WithWidth } from "@material-ui/core/withWidth";

const useStyles = makeStyles({

	container: {
		height: "100vh"
	},

	form: {
		marginTop: 20
	},

	recaptcha: {
		margin: "30px auto"
	}

});


const LoginPage: FunctionComponent<WithWidth> = ({ width }) => {

	const classes = useStyles();
	const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult | null>(null)
	const [recaptchaVerifierRendered, setRecaptchaVerifierRendered] = useState(false)
	const [recaptchaVerifier, setRecaptchaVerifier] = useState<firebase.auth.RecaptchaVerifier>()
	const recaptchaEl = useRef(null);

	useEffect(() => {

			const verifier = new firebase.auth.RecaptchaVerifier(recaptchaEl.current, {
				"size": "invisible", 
			});
			verifier.render().then(()=>{
				setRecaptchaVerifierRendered(true)
			})
			setRecaptchaVerifier(verifier)
			return ()=>verifier.clear()

	}, [width])

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Container fixed>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					className={classes.container}
				>
					<Grid item className={classes.form}>
						{confirmationResult ?
							<SMSVerificationForm confirmationResult={confirmationResult} recaptchaVerifier={recaptchaVerifier}/>
							 :
							 <> 
								<LoginForm setConfirmationResult={setConfirmationResult} recaptchaVerifierRendered={recaptchaVerifierRendered} recaptchaVerifier={recaptchaVerifier}/>
							</>
						}
					</Grid>
					<Grid item >
					<div className={classes.recaptcha} ref={recaptchaEl}/>
					</Grid>
				</Grid>
			</Container>
		</MuiThemeProvider >
	);
}

export default withWidth()(LoginPage);
