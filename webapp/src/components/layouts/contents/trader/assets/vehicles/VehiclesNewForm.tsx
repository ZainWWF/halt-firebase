import React, { useState, useEffect, useContext, useCallback, FunctionComponent } from "react";
import { Formik } from "formik";
import { FirebaseContext, Firebase } from "../../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import VehicleForm from "./VehicleForm";
import vehicleValidationSchema from "./vehicleValidationSchema";
import { VehicleDoc } from "../../../../../types/Vehicle";
import { VehicleAssetContext } from "../AssetsContents";
import { AuthContext } from "../../../../../containers/Main";
import { Grid, CircularProgress } from "@material-ui/core";

const initialValues = {
	colour: "",
	license: "",
	loadingCapacity: 0,
	model: "",
	make: {
		type: "",
		detail: ""
	}
};

const DialogForm: FunctionComponent = () => {

	const [imageFile, setImageFile] = useState();
	const [image, setImage] = useState();
	const [enteredValues, setEnteredValues] = useState(initialValues);
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const user = useContext(AuthContext) as firebase.User;
	const { stateVehicleAssetContext, dispatchVehicleAssetContext } = useContext(VehicleAssetContext)
	const { uploadInProgressState } = stateVehicleAssetContext;
	const storageRef = firebaseApp.storage.ref();

	const imageReader = new FileReader();
	imageReader.onload = () => {
		setImage(imageReader.result)
	}

	const dialogOnCancel = () => {
		dispatchVehicleAssetContext({ newDialog: false })
	}

	const newVehicleUpload = (vehicleDoc: VehicleDoc) => {
		dispatchVehicleAssetContext({ uploadInProgress: true })
		firebaseApp.db.collection('vehicles')
			.add({ ...vehicleDoc, userId: user.uid })
			.then(() => {
				console.log("upload success")
				dispatchVehicleAssetContext({
					uploadInProgress: false,
					newDialog: false
				})
			}).catch((error) => {
				console.log(error)
				// setHasError(error)
			})
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
				// setHasError(error)
			}, function () {
				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					setImageFile({ ...imageFile, downloadURL })
				});
			});
	}, [storageRef, image, imageFile])


	useEffect(() => {
		if (image) {
			uploadVehicleImageCallback()
		}
	}, [image, uploadVehicleImageCallback])

	return (uploadInProgressState ?
		<Grid
			container
			justify="center"
			alignItems="center"
			style={{ height: 100, width: 140, margin: "auto", paddingBottom: 20 }}
		>
			<CircularProgress />
		</Grid>
		:
		<Formik
			initialValues={initialValues}
			validate={values => {
				setEnteredValues(values)
				if (values.make.type !== "Lainnya") {
					values.make.detail = ""
				}
			}}
			validationSchema={vehicleValidationSchema}
			onSubmit={(values) => {
				const {
					colour,
					license,
					loadingCapacity,
					model,
					make: {
						type,
						detail
					},
				} = values;
				newVehicleUpload({
					colour,
					license,
					loadingCapacity: Number(loadingCapacity),
					model,
					make: {
						type,
						detail,
					},
					url: imageFile.downloadURL
				})
			}}
		>
			{({ isValid, errors, touched }) => {
				return (
					< VehicleForm
						errors={errors}
						touched={touched}
						isValid={isValid}
						enteredValues={enteredValues}
						dialogOnCancel={dialogOnCancel}
						changeInputFile={changeInputFile}
						image={image}
						isImage={!!imageFile}
					/>
				)
			}}

		</Formik>
	);
}
export default DialogForm;