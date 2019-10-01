import React, { useState, useEffect, useContext, useCallback, FunctionComponent } from "react";
import { Formik } from "formik";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import VehicleForm from "./VehicleForm";
import vehicleValidationSchema from "./vehicleValidationSchema";
import { VehicleDoc } from "../../../../types/Vehicle";
import { VehicleAssetContext } from "../AssetsContents";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";


const DialogForm: FunctionComponent = () => {
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();
	const { stateVehicleAssetContext, dispatchVehicleAssetContext } = useContext(VehicleAssetContext)
	const { selectedVehicleSummaryState } = stateVehicleAssetContext
	const [selectedVehicleDetail, setSelectedVehicleDetail] = useState();
	const [imageFile, setImageFile] = useState()
	const [image, setImage] = useState();
	const [updatedImageFile, setUpdatedImageFile] = useState();



	useEffect(() => {
		let isSubscribed = true
		selectedVehicleSummaryState.ref.get().then((doc: firebase.firestore.DocumentData) => {
			const result = doc.data() as VehicleDoc
			if (result) {
				if (result && isSubscribed) {

					setSelectedVehicleDetail(result)
					setImageFile({
						name: null,
						downloadURL: result.url
					});
					setImage(result.url)

				}

	

			}
		}).catch((error: Error) => {
			// setHasError(error)
		})
		return () => { isSubscribed = false }
	}, [selectedVehicleSummaryState])

	const editedVehicleUpload = (vehicleDoc: VehicleDoc) => {
		dispatchVehicleAssetContext({ uploadInProgress: true })
		selectedVehicleSummaryState.ref.update(vehicleDoc)
			.then(() => {
				console.log("upload success")
				dispatchVehicleAssetContext({
					uploadInProgress: false,
					editDialog: false
				})
			}).catch((error: Error) => {
				console.log(error)
				// setHasError(error)
			})
	}

	const imageReader = new FileReader();
	imageReader.onload = () => {
		if (imageReader) {
			setImage(imageReader.result as string)
			setImageFile({ ...imageFile, downloadURL: null })
		}
	}

	const dialogOnCancel = () => {
		dispatchVehicleAssetContext({ editDialog: false })
	}

	const changeInputFile = (files: FileList) => {
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
				// setHasError(error)
			}, function () {
				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					setImageFile({ ...imageFile, downloadURL })
				});
			});
	}, [storageRef, image, imageFile, updatedImageFile])


	useEffect(() => {
		if (image) {
			uploadVehicleImageCallback()
		}
	}, [image, uploadVehicleImageCallback])

	return (!selectedVehicleDetail ?
		 <Grid
			container
			justify="center"
			alignItems="center"
			style={{ height: 100, width : 140, margin: "auto", paddingBottom: 20 }}
		>
			<CircularProgress />
		</Grid>
		:
		<Formik
			initialValues={{
				colour: selectedVehicleDetail.colour,
				license: selectedVehicleDetail.license,
				loadingCapacity: selectedVehicleDetail.loadingCapacity,
				model: selectedVehicleDetail.model,
				make: selectedVehicleDetail.make,
				url: selectedVehicleDetail.url
			}}
			validate={values => {
				setSelectedVehicleDetail(values)
				if (values.make.type !== "Lainnya") {
					values.make.detail = ""
				}
			}}
			validationSchema={vehicleValidationSchema}
			onSubmit={(values) => {
				const url = imageFile.downloadURL as string
				editedVehicleUpload({ ...values, url })
			}}
		>
			{({ isValid, errors, touched }) => {
				return (
					< VehicleForm
						errors={errors}
						touched={touched}
						isValid={isValid}
						enteredValues={selectedVehicleDetail}
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