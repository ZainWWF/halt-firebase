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
        <InputLabel htmlFor="adornment-trees-productive">productive</InputLabel>
        <Input
          data-testid="form-field-trees-productive"
          {...field}
          {...props}
          id="adornment-trees-productive"
          error={errors.treesProductive && touched.treesProductive}  
          type="number"
          aria-describedby="component-error-text"
        />
        {errors.treesProductive && touched.treesProductive ? (
        <FormHelperText className={classes.formHelperText} >{errors.treesProductive}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;


