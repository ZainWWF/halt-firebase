import React, { useState, FunctionComponent } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormHelperText,
  IconButton,
} from "@material-ui/core";
import classNames from "classnames";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { InputProps } from "@material-ui/core/Input";
import { FormikValues } from "formik";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles({
  margin: {
    marginBottom: 15
  },
  textField: {
    width: '100%'
  },
  formHelperText: {
    color: "#f44336"
  }
});

interface IProps {
	field: InputProps, form: FormikValues
}


const PasswordField :FunctionComponent<IProps> = ({ field, form, ...props }) => {

	const classes = useStyles();
  const { errors, touched } = form;
	const [showPassword, setshowPassword] = useState(false);

	return (
    <>
      <FormControl
        className={classNames(
          classes.margin,
          classes.textField
        )}
      >
        <InputLabel htmlFor="adornment-password">Password</InputLabel>
        <Input
          data-testid="form-field-password"
          {...field}
          {...props}
          id="adornment-password"
          error={errors.password && touched.password}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setshowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.password && touched.password ? (
          <FormHelperText className={classes.formHelperText}>
            {errors.password}
          </FormHelperText>
        ) : null}
      </FormControl>
    </>
  );
};

export default PasswordField;
