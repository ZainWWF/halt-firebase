import React, { useState, Dispatch, SetStateAction, FunctionComponent, useEffect } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PlantationNameField from "./PlantationNameField";
import PlantationManagementTypeField from "./PlantationManagementTypeField";
import PlantationManagementNameField from "./PlantationManagementNameField";
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
import PlantationAreaField from "./PlantationAreaField";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { PlantationDoc, PlantationDetails } from '../../../../types/Plantation';

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


const UpdatePlantationSchema = Yup.object().shape({
	managementType: Yup.string()
		.required("Required"),
	name: Yup.string().when('managementType', {
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
	area: Yup.number()
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
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	plantationDoc: PlantationDoc | undefined
	setPlantationEditData: Dispatch<SetStateAction< {unAudited: PlantationDetails ,name :string} >>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const DialogForm: FunctionComponent<IProps> = ({ setEditDialogOpen, setViewModalOpen, plantationDoc, setPlantationEditData, setHasError, setUploadInProgress }) => {

	const classes = useStyles();

	const [nameDisabled, setNameDisabled] = useState(true);
	const [otherDisabled, setOtherDisabled] = useState(true);
	const [plasmaDisabled, setPlasmaDisabled] = useState(true);
	const [millDisabled, setMillDisabled] = useState(true);
	const [agreementDisabled, setAgreementDisabled] = useState(true);

	useEffect(()=>{
		if(plantationDoc){
			plantationDoc.unAudited.management.type === "PRIVATE" ?
			setNameDisabled(true) :
			setNameDisabled(false)
		
			plantationDoc.unAudited.management.type=== "OTHER" ?
			setOtherDisabled(false) :
			setOtherDisabled(true)
	
			plantationDoc.unAudited.buyerAssociation.type === "PLASMA_WITH_LEGAL_DOCUMENT" ||
			plantationDoc.unAudited.buyerAssociation.type === "PLASMA_WITH_AGREEMENT" ?
			setPlasmaDisabled(false) :
			setPlasmaDisabled(true)
	
			plantationDoc.unAudited.buyerAssociation.type === "PLASMA_WITH_LEGAL_DOCUMENT" ||
			plantationDoc.unAudited.buyerAssociation.type === "PLASMA_WITH_AGREEMENT" ||
			plantationDoc.unAudited.buyerAssociation.type === "THIRD_PARTY_WITH_AGREEMENT" ?
			setMillDisabled(false) :
			setMillDisabled(true)
	
			plantationDoc.unAudited.buyerAssociation.type === "PLASMA_WITH_AGREEMENT" ||
			plantationDoc.unAudited.buyerAssociation.type === "THIRD_PARTY_WITH_AGREEMENT" ?
			setAgreementDisabled(false) :
			setAgreementDisabled(true)
		}

	},[plantationDoc])

	return (
		<Formik
			initialValues={{
				geometry: plantationDoc!.unAudited.geometry,
				managementType: plantationDoc!.unAudited.management.type,
				managementName: plantationDoc!.unAudited.management.name === "N/A" ? "" : plantationDoc!.unAudited.management.name,
				other: plantationDoc!.unAudited.management.otherDetails === "N/A" ? "" : plantationDoc!.unAudited.management.otherDetails,
				associationType: plantationDoc!.unAudited.buyerAssociation.type,
				plasma: plantationDoc!.unAudited.buyerAssociation.plasma === "N/A" ? "" : plantationDoc!.unAudited.buyerAssociation.plasma,
				mill: plantationDoc!.unAudited.buyerAssociation.mill === "N/A" ? "" : plantationDoc!.unAudited.buyerAssociation.mill,
				agreement: plantationDoc!.unAudited.buyerAssociation.agreement === "N/A" ? "" : plantationDoc!.unAudited.buyerAssociation.agreement,
				certificationType: plantationDoc!.unAudited.certification,
				area: plantationDoc!.unAudited.area,
				plantationAge: plantationDoc!.unAudited.age,
				treesPlanted: plantationDoc!.unAudited.treesPlanted,
				treesProductive: plantationDoc!.unAudited.treesProductive,
				aveMonthlyYield: plantationDoc!.unAudited.aveMonthlyYield,
				proofOfRights: plantationDoc!.unAudited.proofOfRights,
				landPreviousUse: plantationDoc!.unAudited.landPreviousUse,
				landClearingMethod: plantationDoc!.unAudited.landClearingMethod,
				plantationName: plantationDoc!.name
			}}
			validate={values => {
				values.managementType === "PRIVATE" ?
					setNameDisabled(true) :
					setNameDisabled(false)

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

				if (nameDisabled) {
					values.managementName = ""
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
			validationSchema={UpdatePlantationSchema}
			onSubmit={(values) => {
				setPlantationEditData({
					name: values.plantationName,
					unAudited : {
						geometry : values.geometry,
						management: {
							type: values.managementType,
							name: values.managementName ? values.managementName : 'N/A',
							otherDetails: values.other ? values.other : 'N/A',
						},
						buyerAssociation: {
							type: values.associationType,
							plasma: values.plasma ? values.plasma : 'N/A',
							mill: values.mill ? values.mill : 'N/A',
							agreement: values.agreement ? values.agreement : 'N/A'
						},
						certification: values.certificationType,
						area: values.area,
						age: values.plantationAge,
						treesPlanted: values.treesPlanted,
						treesProductive: values.treesProductive,
						aveMonthlyYield: values.aveMonthlyYield,
						proofOfRights: values.proofOfRights,
						landPreviousUse: values.landPreviousUse,
						landClearingMethod: values.landClearingMethod,
					}

				})
				setEditDialogOpen(false)
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
							disabled={nameDisabled}
							name="managementName"
							component={PlantationManagementNameField}
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
							name="area" component={PlantationAreaField} />
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
							onClick={() => { setEditDialogOpen(false); setViewModalOpen(true) }}
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
							Update
            </Button>
					</DialogActions>
				</Form>
			)}
		</Formik>
	);
}

export default DialogForm;