import React, { FunctionComponent } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	InputAdornment,
	FormHelperText,
} from "@material-ui/core";
import classNames from "classnames";
import Phone from "@material-ui/icons/Phone";
// import { makeStyles } from "@material-ui/styles";
import { InputProps } from "@material-ui/core/Input";
import { FormikValues } from "formik";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	margin: {
		marginBottom: 15
	},
	textField: {
		width: '100%'
	},
	formHelperText: {
		color: "#f44336"
	},
	icon: {
		marginLeft: 8,
		marginRight: 8
	}
});


interface IProps {
	field: InputProps, form: FormikValues
}

const PhoneNumberField: FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	const { errors, touched } = form;
	
	return (
		<>
			<FormControl className={classNames(classes.margin, classes.textField)}>
				<InputLabel htmlFor="adornment-phone_number">Mobile</InputLabel>
				<Input
					data-testid="form-field-phone-number"
					{...field}
					{...props}
					id="adornment-phone_number"
					error={errors.phone_number && touched.phone_number}
					type="tel"
					endAdornment={
						<InputAdornment position="end">
							<Phone className={classes.icon} />
						</InputAdornment>
					}
					aria-describedby="component-error-text"
				/>
				{errors.phone_number && touched.phone_number ? (
					<FormHelperText className={classes.formHelperText} >{errors.phone_number}</FormHelperText>
				) : null}
			</FormControl>
		</>
	);
};


export default PhoneNumberField;
