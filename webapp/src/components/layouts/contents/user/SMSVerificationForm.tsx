/**
 *  The SMS Code verification page nested within the
 *  Registration Page
 */
import React, { useEffect, useState, FunctionComponent } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { Formik, Form, Field } from 'formik';
import { Grid, Button, Typography, Snackbar, Link } from '@material-ui/core';
import * as Yup from 'yup';
import SMSCodeField from './SMSCodeField';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles({
	button: {
		width: '100%',
		marginTop: 20
	},
	link: {
		margin: 10
	},
	field: {
		width: '100%'
	}
});

const SMSCodeSchema = Yup.object().shape({
	sms_code: Yup.string().required('Required')
});

interface IProps {
	confirmationResult: firebase.auth.ConfirmationResult
	recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined
}
const SMSVerificationForm: FunctionComponent<IProps> = ({ confirmationResult, recaptchaVerifier }) => {

	const classes = useStyles();

	const [signInError, setSignInError] = useState<Error | null>(null)
	const [showError, setShowError] = useState(false);


	useEffect(() => {
		if (signInError) {
			setShowError(true)
		}
	}, [signInError])

	useEffect(() => {
		if (recaptchaVerifier) recaptchaVerifier.clear()
	}, [recaptchaVerifier])
	/** route to Main Page if user is verified */
	return (
		<>
			<Typography variant="h6" align="center">
				Mobile Number Verification
      </Typography>
			<Formik
				initialValues={{ sms_code: '' }}
				validationSchema={SMSCodeSchema}
				onSubmit={values => {
					const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, values.sms_code);
					firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
						.then(function () {
							return firebase.auth().signInWithCredential(credential)
								.then((result) => {
									window.location.assign("/");
								})
								.catch((error) => {
									setSignInError(error)
								});
						})
						.catch(function (error) {
							setSignInError(error)
						});


				}}
			>
				{(isValid) => (
					<Form>
						<Grid
							container
							justify="center"
							alignItems="center"
						>

							<Field name="sms_code" component={SMSCodeField} />

							<Button
								data-testid="sms-form-button-submit"
								type="submit"
								disabled={!isValid}
								variant="contained"
								color="primary"
								className={classes.button}
							>
								Verify
                </Button>

							<Snackbar
								anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
								key={`bottom,center`}
								open={showError}
								onClose={() => setShowError(false)}
								autoHideDuration={6000}
								ContentProps={{
									"aria-describedby": "message-id",
								}}
								message={<span id="message-id">{signInError ? signInError.message : null}</span>}
							/>

						</Grid>
						<Grid item className={classes.link}>
							<Typography align='right'>
								<Link onClick={() => window.location.assign("/")} >
									Cancel
                  </Link>
							</Typography>
						</Grid>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default SMSVerificationForm
