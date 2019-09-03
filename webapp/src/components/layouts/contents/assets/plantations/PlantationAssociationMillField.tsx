import React, { FunctionComponent, MutableRefObject } from "react";
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
	field: InputProps 
	form: FormikValues
	inputRef: MutableRefObject<any>
}

const Field : FunctionComponent<IProps> = ({ field, form, inputRef, ...props }) => {

	const classes = useStyles();
	const { errors, touched } = form;
	return (
		<>
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor="adornment-mill">mill</InputLabel>
        <Input
          data-testid="form-field-mill"
          {...field}
          {...props}
          id="adornment-mill"
          error={errors.mill && touched.mill}  
          type="text"
					aria-describedby="component-error-text"
					inputRef={inputRef}

        />
        {errors.mill && touched.mill ? (
        <FormHelperText className={classes.formHelperText} >{errors.mill}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;


