import React, { FunctionComponent } from "react";
import {
	FormControl,
	InputLabel,
	Input,
	Theme,
	FormHelperText,
	makeStyles,
	createStyles,
	InputAdornment
} from "@material-ui/core";
import classNames from "classnames";
import { InputProps } from "@material-ui/core/Input";
import { FormikValues } from "formik";
import SearchIcon from '@material-ui/icons/Search';
import { fade } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
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
	field: InputProps, form: FormikValues
}

const Field: FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	const { errors } = form;
	return (
		<>
			<FormControl className={classNames(classes.margin, classes.root)}>
				<div className={classes.search}>
					<InputLabel shrink htmlFor="adornment-plantation-rep-phone">Add Producer Rep</InputLabel>
					<Input
						id="adornment-plantation-rep-phone"
						type="search"
						autoFocus
						fullWidth
						{...field}
						{...props}
						placeholder="Search Mobile"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						startAdornment={
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						}
						inputProps={{
							'aria-label': 'search',
						}}
					/>
				</div>
				{errors.plantationRepPhoneNumber && (
					<FormHelperText className={classes.formHelperText} >{errors.plantationRepPhoneNumber}</FormHelperText>
				)}
			</FormControl>
		</>
	);
};


export default Field;

