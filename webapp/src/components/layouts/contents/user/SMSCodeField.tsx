import React, { FunctionComponent } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	InputAdornment,
	FormHelperText,
} from "@material-ui/core";
import classNames from "classnames";
import Sms from "@material-ui/icons/Sms";
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

const SMSCodeField: FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	
	const { errors, touched } = form;
	
	return (
		<>
			<FormControl className={classNames(classes.margin, classes.textField)}>
				<InputLabel htmlFor="adornment-sms_code">SMS CODE</InputLabel>
				<Input
					data-testid="form-field-sms-code"
					{...field}
					{...props}
					id="adornment-sms_code"
					error={errors.sms_code && touched.sms_code}
					type="text"
					endAdornment={
						<InputAdornment position="end">
							<Sms className={classes.icon} />
						</InputAdornment>
					}
					aria-describedby="component-error-text"
				/>
				{errors.sms_code && touched.sms_code ? (
					<FormHelperText className={classes.formHelperText} >{errors.sms_code}</FormHelperText>
				) : null}
			</FormControl>
		</>
	);
};


export default SMSCodeField;
