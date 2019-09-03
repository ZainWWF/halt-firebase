import React, { FunctionComponent } from "react";
import {
	FormControl,
	InputLabel,
	FormHelperText,
	makeStyles,
	Select,
	MenuItem,
} from "@material-ui/core";
import classNames from "classnames";
import { FormikValues } from "formik";
import { SelectProps } from "@material-ui/core/Select";

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
	field: SelectProps, form: FormikValues
}

const Field : FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	const { errors, touched } = form;
	return (
		<>
     <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor="adornment-management-type">type</InputLabel>
        <Select
          data-testid="form-field-management-type-select"
          {...field}
          {...props}
          id="adornment-management-type"
          error={errors.managementType && touched.managementType}
          aria-describedby="component-error-text"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'PRIVATE'}>Private</MenuItem>
          <MenuItem value={'FARMER_GROUP'}>Farmer's Group</MenuItem>
          <MenuItem value={'COOPERATIVE'}>Cooperative</MenuItem>
          <MenuItem value={'CONCESSION_COMPANY'}>Concession Company</MenuItem>
          <MenuItem value={'OTHER'}>Other</MenuItem>
        </Select>
        {errors.managementType && touched.managementType ? (
          <FormHelperText className={classes.formHelperText} >{errors.managementType}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;

