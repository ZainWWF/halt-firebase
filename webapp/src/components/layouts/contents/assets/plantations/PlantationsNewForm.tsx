import React, { useState, useEffect, useContext, useCallback, FunctionComponent, Dispatch, SetStateAction } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DialogContent, DialogActions } from "@material-ui/core";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import PlantationNameField from "./PlantationNameField";
import PlantationManagementTypeField from "./PlantationManagementTypeField";
import PlantationManagementConcessionCompanyField from "./PlantationManagementConcessionCompanyField";
import PlantationManagementOtherField from "./PlantationManagementOtherField";
import PlantationAssociationTypeField from "./PlantationAssociationTypeField";
import PlantationAssociationPlasmaField from "./PlantationAssociationPlasmaField";
import PlantationAssociationMillField from "./PlantationAssociationMillField";
import PlantationAssociationAgreementField from "./PlantationAssociationAgreementField";
import PlantationCertificationField from "./PlantationCertificationField";
import PlantationAgeField from "./PlantationAgeField";
import PlantationTreesPlantedField from "./PlantationTreesPlantedField";
import PlantationTreesProductiveField from "./PlantationTreesProductiveField";
import PlantationAveMonthlyYieldField from "./PlantationAveMonthlyYieldField";
import PlantationProofOfRightsField from "./PlantationProofOfRightsField";
import PlantationPreviousLandUseField from "./PlantationPreviousLandUseField";
import PlantationClearLandMethodField from "./PlantationClearLandMethodField";
import PlantationSizeDeclaredField from "./PlantationSizeDeclaredField";
import { makeStyles } from "@material-ui/styles";


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


const CreatePlantationSchema = Yup.object().shape({
	managementType: Yup.string()
		.required("Required"),
	concessionCompany: Yup.string().when('managementType', {
		is: value => value === "CONCESSION_COMPANY",
		otherwise: Yup.string().notRequired(),
		then: Yup.string().required('Required'),
	}),
	other: Yup.string().when('managementType', {
		is: value => value === "OTHER",
		otherwise: Yup.string().notRequired(),
		then: Yup.string().required('Required'),
	}),
	associationType: Yup.string()
		.required("Required"),
	plasma: Yup.string().when('associationType', {
		is: value => value === "PLASMA_WITH_LEGAL_DOCUMENT" || value === "PLASMA_WITH_AGREEMENT",
		otherwise: Yup.string().notRequired(),
		then: Yup.string().required('Required'),
	}),
	mill: Yup.string().when('associationType', {
		is: value => value === "PLASMA_WITH_LEGAL_DOCUMENT" || value === "PLASMA_WITH_AGREEMENT" || value === "THIRD_PARTY_WITH_AGREEMENT",
		otherwise: Yup.string().notRequired(),
		then: Yup.string().required('Required'),
	}),
	agreement: Yup.string().when('associationType', {
		is: value => value === "PLASMA_WITH_AGREEMENT" || value === "THIRD_PARTY_WITH_AGREEMENT",
		otherwise: Yup.string().notRequired(),
		then: Yup.string().required('Required'),
	}),
	certificationType: Yup.string()
		.required("Required"),
	sizeDeclared: Yup.number()
		.integer("Invalid Value")
		.moreThan(0)
		.required("Required"),
	plantationAge: Yup.number()
		.integer("Invalid Value")
		.moreThan(0)
		.integer("Required"),
	treesPlanted: Yup.number()
		.integer("Invalid Value")
		.moreThan(0)
		.required("Required"),
	treesProductive: Yup.number()
		.integer("Invalid Value")
		.moreThan(0)
		.required("Required"),
	aveMonthlyYield: Yup.number()
		.moreThan(0)
		.required("Required"),
	proofOfRights: Yup.string()
		.required("Required"),
	landPreviousUse: Yup.string()
		.required("Required"),
	landClearingMethod: Yup.string()
		.required("Required"),
	plantationName: Yup.string()
		.required("Required")
});


interface IProps {
	setNewDialogOpen: Dispatch<SetStateAction<boolean>>
	setPlantationFormData: Dispatch<SetStateAction<any>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const  DialogForm:FunctionComponent<IProps> =  ({  setNewDialogOpen, setPlantationFormData, setHasError, setUploadInProgress }) =>{

	const classes = useStyles();

	const [concessionCompanyDisabled, setConcessionCompanyDisabled] = useState(true);
	const [otherDisabled, setOtherDisabled] = useState(true);
	const [plasmaDisabled, setPlasmaDisabled] = useState(true);
	const [millDisabled, setMillDisabled] = useState(true);
	const [agreementDisabled, setAgreementDisabled] = useState(true);

	const [imageFile, setImageFile] = useState();
	const [image, setImage] = useState();
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const storageRef = firebaseApp.storage.ref();

	const imageReader = new FileReader();
	imageReader.onload = () => {
		setImage(imageReader.result)
	}


	const uploadPlantationImageCallback = useCallback(() => {

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
			uploadPlantationImageCallback()
		}
	}, [image, uploadPlantationImageCallback])

	return (
		<Formik
			initialValues={{
				managementType: "",
				concessionCompany: "",
				other: "",
				associationType: "",
				plasma: "", mill: "",
				agreement: "",
				certificationType: "",
				sizeDeclared: "",
				plantationAge: "",
				treesPlanted: "",
				treesProductive: "",
				aveMonthlyYield: "",
				proofOfRights: "",
				landPreviousUse: "",
				landClearingMethod: "",
				plantationName: ""
			}}
			validate={values => {
				values.managementType === "CONCESSION_COMPANY" ?
					setConcessionCompanyDisabled(false) :
					setConcessionCompanyDisabled(true)

				values.managementType === "OTHER" ?
					setOtherDisabled(false) :
					setOtherDisabled(true)

				values.associationType === "PLASMA_WITH_LEGAL_DOCUMENT" ||
					values.associationType === "PLASMA_WITH_AGREEMENT" ?
					setPlasmaDisabled(false) :
					setPlasmaDisabled(true)

				values.associationType === "PLASMA_WITH_LEGAL_DOCUMENT" ||
					values.associationType === "PLASMA_WITH_AGREEMENT" ||
					values.associationType === "THIRD_PARTY_WITH_AGREEMENT" ?
					setMillDisabled(false) :
					setMillDisabled(true)

				values.associationType === "PLASMA_WITH_AGREEMENT" ||
					values.associationType === "THIRD_PARTY_WITH_AGREEMENT" ?
					setAgreementDisabled(false) :
					setAgreementDisabled(true)

				if (concessionCompanyDisabled) {
					values.concessionCompany = ""
				}

				if (otherDisabled) {
					values.other = ""
				}

				if (plasmaDisabled) {
					values.plasma = ""
				}

				if (millDisabled) {
					values.mill = ""
				}

				if (agreementDisabled) {
					values.agreement = ""
				}

			}}
			validationSchema={CreatePlantationSchema}
			onSubmit={(values) => {
				setUploadInProgress(true)
				setPlantationFormData({
					name: values.plantationName,
					management: {
						type: values.managementType,
						concessionCompany: values.concessionCompany.length > 0 ? values.concessionCompany : 'N/A',
						otherDetails: values.other.length > 0 ? values.other : 'N/A',
					},
					buyerAssociation: {
						type: values.associationType,
						plasma: values.plasma.length > 0 ? values.plasma : 'N/A',
						mill: values.mill.length > 0 ? values.mill : 'N/A',
						agreement: values.agreement.length > 0 ? values.agreement : 'N/A'
					},
					certification: values.certificationType,
					sizeDeclared: parseInt(values.sizeDeclared.toString()),
					age: parseInt(values.plantationAge.toString()),
					treesPlanted: parseInt(values.treesPlanted.toString()),
					treesProductive: parseInt(values.treesProductive.toString()),
					aveMonthlyYield: parseInt(values.aveMonthlyYield.toString()),
					proofOfRights: values.proofOfRights,
					landPreviousUse: values.landPreviousUse,
					landClearingMethod: values.landClearingMethod
				})
				setNewDialogOpen(false)

			}}
		>
			{(isValid) => (
				<Form>
					<DialogContent>
						<Field
							name="plantationName" component={PlantationNameField} />
						<Typography color="textSecondary" variant="caption" >
							Management
            </Typography>
						<Field
							name="managementType" component={PlantationManagementTypeField} />
						<Field
							disabled={concessionCompanyDisabled}
							name="concessionCompany"
							component={PlantationManagementConcessionCompanyField}
						/>
						<Field
							disabled={otherDisabled}
							name="other"
							component={PlantationManagementOtherField}
						/>

						<Typography color="textSecondary" variant="caption">
							Association
            </Typography>
						<Field
							name="associationType" component={PlantationAssociationTypeField} />
						<Field
							disabled={plasmaDisabled}
							name="plasma"
							component={PlantationAssociationPlasmaField}
						/>
						<Field
							disabled={millDisabled}
							name="mill"
							component={PlantationAssociationMillField}
						/>
						<Field
							disabled={agreementDisabled}
							name="agreement"
							component={PlantationAssociationAgreementField}
						/>

						<Typography color="textSecondary" variant="caption">
							Certification
            </Typography>
						<Field
							name="certificationType" component={PlantationCertificationField} />


						<Typography color="textSecondary" variant="caption">
							Plantation
              </Typography>
						<Field
							name="sizeDeclared" component={PlantationSizeDeclaredField} />
						<Field
							name="plantationAge" component={PlantationAgeField} />
						<Field
							name="treesPlanted" component={PlantationTreesPlantedField} />
						<Field
							name="treesProductive" component={PlantationTreesProductiveField} />
						<Field
							name="aveMonthlyYield" component={PlantationAveMonthlyYieldField} />
						<Field
							name="proofOfRights" component={PlantationProofOfRightsField} />
						<Field
							name="landPreviousUse" component={PlantationPreviousLandUseField} />
						<Field
							name="landClearingMethod" component={PlantationClearLandMethodField} />

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
							disabled={!isValid}
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