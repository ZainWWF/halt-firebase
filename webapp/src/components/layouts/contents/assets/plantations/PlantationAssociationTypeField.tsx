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
        <InputLabel htmlFor="adornment-association-type">type</InputLabel>
        <Select
          data-testid="form-field-association-type-select"
          {...field}
          {...props}
          id="adornment-association-type"
          error={errors.associationType && touched.associationType}
          aria-describedby="component-error-text"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'PLASMA_WITH_LEGAL_DOCUMENT'}>Plasma With Legal Document</MenuItem>
          <MenuItem value={'PLASMA_WITH_AGREEMENT'}>Plasma With Agreement</MenuItem>
          <MenuItem value={'THIRD_PARTY_WITH_AGREEMENT'}>Third Party With Agreement</MenuItem>
          <MenuItem value={'NO_AGREEMENT'}>No Agreement</MenuItem>
        </Select>
        {errors.associationType && touched.associationType ? (
          <FormHelperText className={classes.formHelperText} >{errors.associationType}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;


