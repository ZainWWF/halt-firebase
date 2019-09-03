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
        <InputLabel htmlFor="adornment-clear-land-method">land clearing method</InputLabel>
        <Select
          data-testid="form-field-clear-land-method-select"
          {...field}
          {...props}
          id="adornment-clear-land-method"
          error={errors.clearLandMethod && touched.clearLandMethod}
          aria-describedby="component-error-text"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Heavy_equipment'}>Heavy Equipment</MenuItem>
          <MenuItem value={'Manual_with_fire'}>Manual with Fire</MenuItem>
          <MenuItem value={'Manual_without_fire'}>Manual without Fire</MenuItem>
        </Select>
        {errors.clearLandMethod && touched.clearLandMethod ? (
          <FormHelperText className={classes.formHelperText} >{errors.clearLandMethod}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;

