import React, { useState, useEffect, useContext, useCallback, FunctionComponent, Dispatch, SetStateAction } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import MakeField from "./VehicleMakeField";
import LicenseField from "./VehicleLicenseField";
import ColourField from "./VehicleColourField";
import ChassisField from "./VehicleChassisField";
import LoadingCapacityField from "./VehicleLoadingCapacityField";
import { DialogContent, DialogActions } from "@material-ui/core";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { makeStyles } from "@material-ui/styles";
import { Vehicle } from "../../../../types/Vehicle";

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
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	vehicleMoreDetail: Vehicle
	setVehicleEditData: Dispatch<SetStateAction<Vehicle>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const DialogForm: FunctionComponent<IProps> = ({ setEditDialogOpen, setViewModalOpen, vehicleMoreDetail, setVehicleEditData, setHasError, setUploadInProgress }) => {

	const classes = useStyles();

	const [updatedImageFile, setUpdatedImageFile] = useState();
	const [imageFile, setImageFile] = useState<{ name: string | null, downloadURL: string | null }>({
		name: null,
		downloadURL: vehicleMoreDetail.url 
	});
	const [image, setImage] = useState(vehicleMoreDetail.url);


	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();

	const imageReader = new FileReader();
	imageReader.onload = () => {
		if (imageReader) {
			setImage(imageReader.result as string)
			setImageFile({ ...imageFile, downloadURL: null })
		}

	}

	const changeInputFile = (files: FileList ) => {
		if (files[0]) {
			imageReader.readAsDataURL(files[0]);
			setUpdatedImageFile(files[0])

		}
	}

	const uploadVehicleImageCallback = useCallback(() => {

		if (imageFile.downloadURL) return;
		const uploadTask = storageRef.child(`images/${updatedImageFile.name}_${Date.now()}`).putString(image, 'data_url');

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
					setImageFile({ ...updatedImageFile, downloadURL })
				});
			});
	}, [storageRef, image, imageFile, updatedImageFile, setHasError])


	useEffect(() => {
		if (image) {
			uploadVehicleImageCallback()
		}
	}, [image, uploadVehicleImageCallback])

	return (
		<Formik
			initialValues={{
				chassis: vehicleMoreDetail.chassis,
				colour: vehicleMoreDetail.colour,
				license: vehicleMoreDetail.license,
				loadingCapacity: vehicleMoreDetail.loadingCapacity,
				make: vehicleMoreDetail.make,
			}}

			validationSchema={CreateVehicleSchema}
			onSubmit={async (values) => {
				setUploadInProgress(true)
				const {
					chassis,
					colour,
					license,
					loadingCapacity,
					make
				} = values;

				setVehicleEditData({
					chassis: chassis,
					colour,
					license,
					loadingCapacity,
					make,
					url: imageFile.downloadURL as string
				})
				setEditDialogOpen(false)

			}}
		>
			{(isValid) => (
				<Form>
					<DialogContent>
						<Field
							name="license" component={LicenseField}
							disabled={true}
						/>
						<Field
							name="make" component={MakeField}
							disabled={true}
						/>
						<Field
							name="chassis"
							component={ChassisField}
							disabled={true}
						/>
						<Field
							name="colour"
							component={ColourField}
						/>
						<Field
							name="loadingCapacity"
							component={LoadingCapacityField}
						/>
						<label className={classes.inputLabel}>
							<Typography align='left' className={classes.imageLabel}>
								Change Image...
              </Typography>
							<input
								onChange={e => changeInputFile(e.target.files as FileList)}
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
							onClick={() => { setEditDialogOpen(false); setViewModalOpen(true) }}
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
							Update
            </Button>
					</DialogActions>
				</Form>
			)}
		</Formik>
	);
}

export default DialogForm;