import React, { FunctionComponent, memo } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	FormHelperText,
	makeStyles,
	Theme,
	createStyles,
} from "@material-ui/core";
import classNames from "classnames";
import { fade } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		textField: {
			width: '100%'
		},
		margin: {
			marginBottom: 15
		},
		formHelperText: {
			color: "#f44336"
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(1),
				width: 'auto',
			},
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 7),
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				width: 120,
				'&:focus': {
					width: 200,
				},
			},
		},
		inputRoot: {
			color: 'inherit',
		},
	}));

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
				<InputLabel shrink htmlFor={`adornment-${name}`}>{label && label}</InputLabel>
				<Input
					data-testid={`testid-${name}`}
					{...props}
					name={name}
					id={`adornment-${name}`}
					error={!!error && !!touched}
					aria-describedby="component-error-text"
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					inputProps={{
						'aria-label': 'search',
					}}
				/>
				{!!error && !!touched &&
					<FormHelperText className={classes.formHelperText} >{error}</FormHelperText>
				}
			</FormControl>
		</>
	);
});

export default Field;


