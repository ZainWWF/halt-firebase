/**
 * The Login Form nested within the Login Page
 */
import React, { useEffect, useState, SetStateAction, FunctionComponent, Dispatch } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Grid, Button, Typography, Snackbar } from "@material-ui/core";
import PhoneNumberField from "./PhoneNumberField";
import * as firebase from "firebase/app";
import "firebase/auth";
// import { makeStyles } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	button: {
		width: "100%",
		marginTop: 20
	},

});

const LoginSchema = Yup.object().shape({
	phone_number: Yup.string()
		.matches(/^\+/, "Requires country code")
		.matches(/^\+\d{10,20}$/, "Number is not valid")
		.required("Required"),
});



interface IProps {

	setConfirmationResult: Dispatch<SetStateAction<firebase.auth.ConfirmationResult | null>>
	recaptchaVerifierRendered: boolean
	recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined
}

const LoginForm: FunctionComponent<IProps> = ({ setConfirmationResult, recaptchaVerifierRendered, recaptchaVerifier }) => {


	const classes = useStyles();
	const [signInError, setSignInError] = useState(null)
	const [showError, setShowError] = useState(false);

	useEffect(() => {
		if (signInError) {
			setShowError(true)
		}
	}, [signInError])

	return (
		<>
			<Formik
				initialValues={{ phone_number: "", recaptchaVerified: false }}
				validationSchema={LoginSchema}
				onSubmit={values => {
					firebase.auth().signInWithPhoneNumber(values.phone_number, recaptchaVerifier as firebase.auth.RecaptchaVerifier)
						.then(function (confirmationResult) {
							setConfirmationResult(confirmationResult)
						}).catch(error => setSignInError(error));
				}}
			>
				{({ isValid }) => (
					<Form>
						<Grid
							container
							justify="center"
							alignItems="center"
						>
							<Typography variant="h6" align="center">
								Halt App
							</Typography>
							<Field
								name="phone_number" component={PhoneNumberField} />

							<Button
								data-testid="login-button-submit"
								type="submit"
								disabled={!isValid || !recaptchaVerifierRendered}
								variant="contained"
								color="primary"
								className={classes.button}
							>
								Login
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
								message={<span id="message-id">{signInError}</span>}
							/>
						</Grid>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default LoginForm;
