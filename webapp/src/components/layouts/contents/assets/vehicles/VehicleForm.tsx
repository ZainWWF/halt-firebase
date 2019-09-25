import React, { memo, FunctionComponent } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Form, Field } from "formik";
import { DialogContent, DialogActions } from "@material-ui/core";
import SingleField from "../../../fields/SingleField"
import SelectField from "../../../fields/SelectField"
import { makeStyles } from "@material-ui/core/styles";
import { MakeType } from "../../../../../config/vehicleAnswerChoices";

const useStyles = makeStyles({
	form: {
		margin: 50
	},
	inputLabel: {
		cursor: "pointer",
	},
	imageLabel: {
		margin: "20px auto",
		fontWeight: 400,
		fontSize: "1em",
		color: "rgba(0, 0, 0, 0.54)"
	},
	formButton: {
		margin: "0 10px 0 10px"
	},
	image: {
		objectFit: "contain" as "contain",
		height: "auto",
		width: "100%",
		maxWidth: 480,
		margin: "10px 20px"
	}
});

interface IProps {
	changeInputFile: (filelist: FileList) => void
	dialogOnCancel: () => void
	isImage: boolean
	isValid: boolean
	errors: { [key: string]: any },
	touched: { [key: string]: any }
	enteredValues : any
	image: string
}

const VehicleForm: FunctionComponent<IProps> = memo(({ image, isImage, enteredValues, isValid, errors, touched, dialogOnCancel, changeInputFile }) => {
	const classes = useStyles();

	return (
		<Form>
			<DialogContent>
				<Field name="license"
					as={SingleField}
					error={errors.license}
					touched={touched.license}
					type="text"
					label="license" />
				<Field name="make.type"
					as={SelectField}
					error={ errors.make && errors.make.type }
					touched={errors.make && touched.make.type}
					type="text"
					label="make"
					choices={MakeType} />
				{enteredValues.make.type === "Lainnya" &&
					<Field name="make.detail"
						as={SingleField}
						error={ errors.make && errors.make.detail }
						touched={errors.make && touched.make.detail}
						type="text" 
						label="detail" />
				}
				<Field name="model"
					as={SingleField}
					error={errors.model}
					touched={touched.model}
					type="text"
					label="model" />
				<Field name="colour"
					as={SingleField}
					error={errors.colour}
					touched={touched.colour}
					type="text"
					label="colour" />

				<Field name="loadingCapacity"
					as={SingleField}
					error={errors.loadingCapacity}
					touched={touched.loadingCapacity}
					type="number"
					label="loadingCapacity" />

				<label className={classes.inputLabel}>
					<Typography align='left' className={classes.imageLabel}>
						Select Image...
			</Typography>
					<input
						onChange={(e) => changeInputFile(e.target.files as FileList)}
						accept="image/*"
						type="file"
						style={{ display: "none" }}
					/>
					<img src={image} className={classes.image} alt="" />
				</label>
			</DialogContent>
			<DialogActions>
				<Button variant="contained"
					data-testid="plantation-button-cancel"
					color="primary"
					className={classes.formButton}
					onClick={dialogOnCancel}
				>
					Cancel
		</Button>
				<Button variant="contained"
					data-testid="plantation-button-submit"
					type="submit"
					color="primary"
					className={classes.formButton}
					disabled={!isValid || !isImage}
				>
					Submit
		</Button>
			</DialogActions>
		</Form>
	)
})


export default VehicleForm