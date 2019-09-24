import React, { useState, useEffect, useContext, useCallback, FunctionComponent, SetStateAction, Dispatch } from "react";
import { Formik } from "formik";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import VehicleForm from "./VehicleForm";
import vehicleValidationSchema from "./vehicleValidationSchema";
import { VehicleDoc } from "../../../../types/Vehicle";


interface IProps {
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setVehicleEditData: Dispatch<SetStateAction<any>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
	vehicleMoreDetail: VehicleDoc
}

const DialogForm: FunctionComponent<IProps> = ({ vehicleMoreDetail, setViewModalOpen, setEditDialogOpen, setVehicleEditData, setHasError, setUploadInProgress }) => {

	const [updatedImageFile, setUpdatedImageFile] = useState();
	const [imageFile, setImageFile] = useState<{ name: string | null, downloadURL: string | null }>({
		name: null,
		downloadURL: vehicleMoreDetail.url
	});
	const [image, setImage] = useState(vehicleMoreDetail.url);
	const [enteredValues, setEnteredValues] = useState(vehicleMoreDetail);

	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();

	const imageReader = new FileReader();
	imageReader.onload = () => {
		if (imageReader) {
			setImage(imageReader.result as string)
			setImageFile({ ...imageFile, downloadURL: null })
		}
	}
	
	const dialogOnCancel = () => {
		setEditDialogOpen(false);
		setViewModalOpen(true)
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
				setHasError(error)
			}, function () {
				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					setImageFile({ ...imageFile, downloadURL })
				});
			});
	}

		, [storageRef, image, imageFile, updatedImageFile, setHasError])


	useEffect(() => {
		if (image) {
			uploadVehicleImageCallback()
		}
	}, [image, uploadVehicleImageCallback])

	return (
		<Formik
		initialValues={{
				colour: vehicleMoreDetail.colour,
				license: vehicleMoreDetail.license,
				loadingCapacity: vehicleMoreDetail.loadingCapacity,
				model: vehicleMoreDetail.model,
				make: vehicleMoreDetail.make,
				url: vehicleMoreDetail.url,
			}}
			validate={values=>		{ 
				setEnteredValues(values)
				if (values.make.type !== "Lainnya") {
					values.make.detail = ""
				}
			}}
			validationSchema={vehicleValidationSchema}
			onSubmit={(values) => {
				setUploadInProgress(true)
				const {
					colour,
					license,
					loadingCapacity,
					model,
					make : {
						type,
						detail
					},
				} = values;

				const url = imageFile.downloadURL as string
				setEnteredValues({...values, url})
				setVehicleEditData({
					colour,
					license,
					loadingCapacity,
					model,
					make : {
						type,
						detail: detail.length > 0 ? detail : 'N/A',
					},
					url
				})
				setEditDialogOpen(false)

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