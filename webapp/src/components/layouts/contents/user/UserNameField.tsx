import React, { FunctionComponent } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	InputAdornment,
	FormHelperText,
} from "@material-ui/core";
import classNames from "classnames";
import AccountCircle from "@material-ui/icons/AccountCircle";
// import { makeStyles } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import { InputProps } from "@material-ui/core/Input";
import { FormikValues } from "formik";

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

const UserNameField: FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	const { errors, touched } = form;

	return (
		<>
			<FormControl className={classNames(classes.margin, classes.textField)}>
				<InputLabel htmlFor="adornment-username">Username</InputLabel>
				<Input
					data-testid="form-field-username"
					{...field}
					{...props}
					id="adornment-username"
					error={errors.username && touched.username}
					type="text"
					endAdornment={
						<InputAdornment position="end">
							<AccountCircle className={classes.icon} />
						</InputAdornment>
					}
					aria-describedby="component-error-text"
				/>
				{errors.username && touched.username ? (
					<FormHelperText className={classes.formHelperText} >{errors.username}</FormHelperText>
				) : null}
			</FormControl>
		</>
	);
};


export default UserNameField;
