import React, { FunctionComponent, memo } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	FormHelperText,
	makeStyles,
} from "@material-ui/core";
import classNames from "classnames";

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
});

interface IProps {
label: string,
 type: string, 
 name: string,
 error: string,
 touched: boolean

}

const Field: FunctionComponent<IProps> = memo(({name, label, error, touched, type, ...props}) => {

	const classes = useStyles();
	
	return (
		<>
			<FormControl className={classNames(classes.margin, classes.textField)}>
				<InputLabel htmlFor={`adornment-${name}`}>{label && label}</InputLabel>
				<Input
					data-testid={`testid-${name}`}
					{...props}
					name={name}
					id={`adornment-${name}`}
					error={!!error && !!touched}
					type={type}
					aria-describedby="component-error-text"
				/>
				{!!error && !!touched &&
					<FormHelperText className={classes.formHelperText} >{error}</FormHelperText>
				}
			</FormControl>
		</>
	);
});

export default Field;


