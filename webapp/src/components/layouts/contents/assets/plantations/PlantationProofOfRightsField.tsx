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
        <InputLabel htmlFor="adornment-proof-of-rights">proof of rights</InputLabel>
        <Select
          data-testid="form-field-proof-of-rights-select"
          {...field}
          {...props}
          id="adornment-proof-of-rights"
          error={errors.proofOfRights && touched.proofOfRights}
          aria-describedby="component-error-text"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Sertifikat_Hak_Milik'}>Sertifikat Hak Milik</MenuItem>
          <MenuItem value={'Surat_Keterangan_Tanah'}>Surat Keterangan Tanah</MenuItem>
          <MenuItem value={'Akta_Jual_Beli'}>Akta Jual Beli</MenuItem>
          <MenuItem value={'Surat_Keterangan_Ganti_Rugi_Lahan'}>Surat Keterangan Ganti Rugi Lahan</MenuItem>
          <MenuItem value={'IUP_B'}>IUP-B</MenuItem>
          <MenuItem value={'IUP'}>IUP</MenuItem>
          <MenuItem value={'HGU'}>HGU</MenuItem>
        </Select>
        {errors.proofOfRights && touched.proofOfRights ? (
          <FormHelperText className={classes.formHelperText} >{errors.proofOfRights}</FormHelperText>
        ) : null}
      </FormControl>
		</>
	);
};


export default Field;


