import React, { FunctionComponent, memo  } from "react";
import {
	FormControl,
	InputLabel,
	FormHelperText,
	makeStyles,
	Select,
	MenuItem,
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
	icon: {
		marginLeft: 8,
		marginRight: 8
	}
});


interface IProps {
	label: string,
	name: string,
	error: string,
	touched: boolean,
	choices: string[]
}

const Field: FunctionComponent<IProps> = memo(({ name, label, error, touched , choices, ...props }) => {

	const classes = useStyles();

	return (
		<>
			<FormControl className={classNames(classes.margin, classes.textField)}>
				<InputLabel htmlFor={`adornment-${name}`}>{label && label}</InputLabel>
				<Select
					data-testid={`testid-${name}`}
					{...props}
					name={name}
					id={`adornment-${name}`}
					error={!!error && !!touched}
					aria-describedby="component-error-text"
				>
					<MenuItem value=""></MenuItem>
					{choices.map(choice => <MenuItem key={choice} value={choice}>{choice}</MenuItem>)}
				</Select>
				{!!error && !!touched &&
					<FormHelperText className={classes.formHelperText} >{error}</FormHelperText>
				}
			</FormControl>
		</>
	);
});


export default Field;

