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
        <InputLabel htmlFor="adornment-previous-land-use">previous land use</InputLabel>
        <Select
          data-testid="form-field-previous-land-use-select"
          {...field}
          {...props}
          id="adornment-previous-land-use"
          error={errors.previousLandUse && touched.previousLandUse}
          aria-describedby="component-error-text"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Natural_Forest'}>Natural Forest</MenuItem>
          <MenuItem value={'Shrub'}>Shrub</MenuItem>
          <MenuItem value={'Grass_Land'}>Grass Land</MenuItem>
          <MenuItem value={'Open_Land'}>Open Land</MenuItem>
          <MenuItem value={'Agriculture'}>Agriculture</MenuItem>
          <MenuItem value={'Other'}>Other</MenuItem>
        </Select>
        {errors.previousLandUse && touched.previousLandUse ? (
          <FormHelperText className={classes.formHelperText} >{errors.previousLandUse}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;
