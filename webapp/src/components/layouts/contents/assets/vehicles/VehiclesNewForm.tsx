import React, { useState, useEffect, useContext, useCallback, FunctionComponent, SetStateAction, Dispatch } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import MakeField from "./VehicleMakeField";
import ModelField from "./VehicleModelField";
import LicenseField from "./VehicleLicenseField";
import ColourField from "./VehicleColourField";
import ChassisField from "./VehicleChassisField";
import LoadingCapacityField from "./VehicleLoadingCapacityField";
import { DialogContent, DialogActions } from "@material-ui/core";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { makeStyles } from "@material-ui/core/styles";

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


const CreateVehicleSchema = Yup.object().shape({
	make: Yup.string()
		.required("Required"),
	model: Yup.string()
		.required("Required"),
	loadingCapacity: Yup.number()
		.moreThan(0)
		.required("Required"),
	license: Yup.string()
		.required("Required"),
	colour: Yup.string()
		.required("Required"),
	chassis: Yup.string()
		.required("Required")
});


interface IProps {
	setNewDialogOpen: Dispatch<SetStateAction<boolean>>
	setVehicleFormData: Dispatch<SetStateAction<any>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>

}

const DialogForm: FunctionComponent<IProps> = ({ setNewDialogOpen, setVehicleFormData, setHasError, setUploadInProgress }) => {

	const classes = useStyles();

	const [imageFile, setImageFile] = useState();
	const [image, setImage] = useState();
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();

	const imageReader = new FileReader();
	imageReader.onload = () => {
		setImage(imageReader.result)
	}

	const changeInputFile = (files: FileList) => {
		setImageFile(files[0])
		if (files[0]) {
			imageReader.readAsDataURL(files[0]);
		}
	}

	const uploadVehicleImageCallback = useCallback(() => {

		if (imageFile.downloadURL) return;

		const uploadTask = storageRef.child(`images/${imageFile.name}_${Date.now()}`).putString(image, 'data_url');

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function (snapshot) {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log('Upload is running');
						break;
				}
			}, function (error) {
				setHasError(error)
			}, function () {
				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					setImageFile({ ...imageFile, downloadURL })
				});
			});
	}

		, [storageRef, image, imageFile, setHasError])


	useEffect(() => {
		if (image) {
			uploadVehicleImageCallback()
		}
	}, [image, uploadVehicleImageCallback])

	return (
		<Formik
			initialValues={{
				chassis: "",
				colour: "",
				license: "",
				loadingCapacity: "",
				model: "",
				make: "",
			}}

			validationSchema={CreateVehicleSchema}
			onSubmit={async (values) => {
				setUploadInProgress(true)
				const {
					chassis,
					colour,
					license,
					loadingCapacity,
					model,
					make
				} = values;

				setVehicleFormData({
					chassis: chassis,
					colour,
					license,
					loadingCapacity,
					model,
					make,
					url: imageFile.downloadURL
				})
				setNewDialogOpen(false)

			}}
		>
			{(isValid) => (
				<Form>
					<DialogContent>
						<Field
							name="license" component={LicenseField}
						/>
						<Field
							name="make" component={MakeField}
						/>
						<Field
							name="model" component={ModelField}
						/>						
						<Field
							name="colour"
							component={ColourField}
						/>
						<Field
							name="chassis"
							component={ChassisField}
						/>
						<Field
							name="loadingCapacity"
							component={LoadingCapacityField}
						/>
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
							onClick={() => setNewDialogOpen(false)}
						>
							Cancel
            </Button>
						<Button variant="contained"
							data-testid="plantation-button-submit"
							type="submit"
							color="primary"
							className={classes.formButton}
							disabled={!isValid || !imageFile}
						>
							Submit
            </Button>
					</DialogActions>
				</Form>
			)}
		</Formik>
	);
}

export default DialogForm;