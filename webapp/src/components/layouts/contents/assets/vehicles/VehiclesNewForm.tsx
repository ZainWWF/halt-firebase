import React, { useState, useEffect, useContext, useCallback, FunctionComponent, SetStateAction, Dispatch } from "react";
import { Formik } from "formik";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import VehicleForm from "./VehicleForm";
import vehicleValidationSchema from "./vehicleValidationSchema";


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



interface IProps {
	setNewDialogOpen: Dispatch<SetStateAction<boolean>>
	setVehicleFormData: Dispatch<SetStateAction<any>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>

}

const DialogForm: FunctionComponent<IProps> = ({ setNewDialogOpen, setVehicleFormData, setHasError, setUploadInProgress }) => {

	const [imageFile, setImageFile] = useState();
	const [image, setImage] = useState();
	const [enteredValues, setEnteredValues] = useState(initialValues);
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();

	const imageReader = new FileReader();
	imageReader.onload = () => {
		setImage(imageReader.result)
	}

	const dialogOnCancel = () => {
		setNewDialogOpen(false)
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
			initialValues={initialValues}
			validate={values => {
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

				setVehicleFormData({
					colour,
					license,
					loadingCapacity : Number(loadingCapacity),
					model,
					make : {
						type,
						detail: detail.length > 0 ? detail : 'N/A',
					},
					url: imageFile.downloadURL
				})
				setNewDialogOpen(false)

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