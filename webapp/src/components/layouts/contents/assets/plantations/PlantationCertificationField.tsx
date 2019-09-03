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
        <InputLabel htmlFor="adornment-certification-type">type</InputLabel>
        <Select
          data-testid="form-field-certification-type-select"
          {...field}
          {...props}
          id="adornment-certification-type"
          error={errors.certificationType && touched.certificationType}
          aria-describedby="component-error-text"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'ISPO'}>ISPO</MenuItem>
          <MenuItem value={'RSPO'}>RSPO</MenuItem>
          <MenuItem value={'NOT_CERTIFIED'}>Not Certified</MenuItem>
        </Select>
        {errors.certificationType && touched.certificationType ? (
          <FormHelperText className={classes.formHelperText} >{errors.certificationType}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;



