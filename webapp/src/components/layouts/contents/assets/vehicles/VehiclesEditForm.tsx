import React, { useState, useEffect, useContext, useCallback, FunctionComponent, SetStateAction, Dispatch } from "react";
import { Formik } from "formik";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import VehicleForm from "./VehicleForm";
import vehicleValidationSchema from "./vehicleValidationSchema";
import { VehicleDoc } from "../../../../types/Vehicle";
import { AssetContext } from "../AssetsContents";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		progress: {
// 			margin: theme.spacing(2),
// 			display: "block",
// 			marginLeft: "auto",
// 			marginRight: "auto",
// 		},
// 		progressContainer : {
// 			width : 120,
// 			height: 120
// 		}
// 	}),
// );



interface IProps {
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setVehicleEditData: (vehicle: VehicleDoc) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
	selectedVehicleDetail: VehicleDoc
}

const DialogForm: FunctionComponent = () => {
	// const classes = useStyles();
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();
	const { stateAssetContext, dispatchAssetContext } = useContext(AssetContext)
	const { selectedVehicleSummaryState, selectedVehicleDetailState } = stateAssetContext
	const [selectedVehicleDetail, setSelectedVehicleDetail] = useState();
	const [imageFile, setImageFile] = useState()
	const [image, setImage] = useState();
	const [updatedImageFile, setUpdatedImageFile] = useState();



	useEffect(() => {
		selectedVehicleSummaryState.ref.get().then((doc: firebase.firestore.DocumentData) => {
			const result = doc.data() as VehicleDoc
			if (result) {

				setSelectedVehicleDetail(result)
				setImageFile({
					name: null,
					downloadURL: result.url
				});
				setImage(result.url)

			}
		}).catch((error: Error) => {
			// setHasError(error)
		})
	}, [selectedVehicleSummaryState])

	const editedVehicleUpload = (vehicleDoc: VehicleDoc) => {
		dispatchAssetContext({ uploadInProgress: true })
		selectedVehicleSummaryState.ref.update(vehicleDoc)
			.then(() => {
				console.log("upload success")
				dispatchAssetContext({
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
		dispatchAssetContext({ editDialog: false })
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