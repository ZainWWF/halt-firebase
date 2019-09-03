import React, { FunctionComponent } from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormHelperText,
	makeStyles
} from '@material-ui/core';
import classNames from 'classnames';
import Email from '@material-ui/icons/Email';
import { InputProps } from '@material-ui/core/Input';
import { FormikValues } from 'formik';


const useStyles = makeStyles({
  margin: {
    marginBottom: 15
  },
  textField: {
    width: '100%'
  },
  formHelperText: {
    color: '#f44336'
  },
  icon: {
    marginLeft: 8,
    marginRight: 8
  }
});


interface IProps {
	field: InputProps, form: FormikValues
}

const EmailField : FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
	const { errors, touched } = form;
	
  return (
    <>
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor="adornment-email">Email</InputLabel>
        <Input
          data-testid="form-field-email"
          {...field}
          {...props}
          id="adornment-email"
          error={errors.email && touched.email}
          type="email"
          endAdornment={
            <InputAdornment position="end">
              <Email className={classes.icon} />
            </InputAdornment>
          }
          aria-describedby="component-error-text"
        />
        {errors.email && touched.email ? (
          <FormHelperText className={classes.formHelperText}>
            {errors.email}
          </FormHelperText>
        ) : null}
      </FormControl>
    </>
  );
};

export default EmailField;
