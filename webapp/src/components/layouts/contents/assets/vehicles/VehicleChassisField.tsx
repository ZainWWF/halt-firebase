import React, { FunctionComponent } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	FormHelperText,
	makeStyles,
} from "@material-ui/core";
import classNames from "classnames";
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

const Field : FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	const { errors, touched } = form;
	return (
		<>
			<FormControl className={classNames(classes.margin, classes.textField)}>
				<InputLabel htmlFor="adornment-chassis">Chassis</InputLabel>
				<Input
					data-testid="form-field-chassis"
					{...field}
					{...props}
					id="adornment-chassis"
					error={errors.chassis && touched.chassis}
					type="text"
					aria-describedby="component-error-text"
				/>
				{errors.chassis && touched.chassis ? (
					<FormHelperText className={classes.formHelperText} >{errors.chassis}</FormHelperText>
				) : null}
			</FormControl>
		</>
	);
};


export default Field;
