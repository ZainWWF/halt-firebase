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
        <InputLabel htmlFor="adornment-ref-name">Reference Name</InputLabel>
        <Input
          data-testid="form-field-ref-name"
          {...field}
          {...props}
          id="adornment-ref-name"
          error={errors.refName && touched.refName}  
          type="text"
          aria-describedby="component-error-text"
        />
        {errors.refName && touched.refName ? (
        <FormHelperText className={classes.formHelperText} >{errors.refName}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;

