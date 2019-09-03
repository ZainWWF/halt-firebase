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
  formHelperText:{
      color : "#f44336"
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
        <InputLabel htmlFor="adornment-plantation-age">age (years)</InputLabel>
        <Input
          data-testid="form-field-plantation-age"
          {...field}
          {...props}
          id="adornment-plantation-age"
          error={errors.plantationAge && touched.plantationAge}  
          type="number"
          aria-describedby="component-error-text"
        />
        {errors.plantationAge && touched.plantationAge ? (
        <FormHelperText className={classes.formHelperText} >{errors.plantationAge}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;

