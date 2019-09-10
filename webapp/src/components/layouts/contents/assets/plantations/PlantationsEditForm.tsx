import React, { useState, Dispatch, SetStateAction, FunctionComponent } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Plantation } from "../../../../types/Plantation";

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
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	plantationMoreDetail: Plantation
	setPlantationEditData: Dispatch<SetStateAction<Plantation>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const DialogForm: FunctionComponent<IProps> = ({ setEditDialogOpen, setViewModalOpen, plantationMoreDetail, setPlantationEditData, setHasError, setUploadInProgress }) => {

	const classes = useStyles();

	const [concessionCompanyDisabled, setConcessionCompanyDisabled] = useState(true);
	const [otherDisabled, setOtherDisabled] = useState(true);
	const [plasmaDisabled, setPlasmaDisabled] = useState(true);
	const [millDisabled, setMillDisabled] = useState(true);
	const [agreementDisabled, setAgreementDisabled] = useState(true);

	return (
		<Formik
			initialValues={{
				managementType: plantationMoreDetail.management.type,
				concessionCompany: plantationMoreDetail.management.concessionCompany === "N/A" ? "" : plantationMoreDetail.management.concessionCompany,
				other: plantationMoreDetail.management.otherDetails === "N/A" ? "" : plantationMoreDetail.management.otherDetails,
				associationType: plantationMoreDetail.buyerAssociation.type,
				plasma: plantationMoreDetail.buyerAssociation.plasma === "N/A" ? "" : plantationMoreDetail.buyerAssociation.plasma,
				mill: plantationMoreDetail.buyerAssociation.mill === "N/A" ? "" : plantationMoreDetail.buyerAssociation.mill,
				agreement: plantationMoreDetail.buyerAssociation.agreement === "N/A" ? "" : plantationMoreDetail.buyerAssociation.agreement,
				certificationType: plantationMoreDetail.certification,
				sizeDeclared: plantationMoreDetail.sizeDeclared,
				plantationAge: plantationMoreDetail.age,
				treesPlanted: plantationMoreDetail.treesPlanted,
				treesProductive: plantationMoreDetail.treesProductive,
				aveMonthlyYield: plantationMoreDetail.aveMonthlyYield,
				proofOfRights: plantationMoreDetail.proofOfRights,
				landPreviousUse: plantationMoreDetail.landPreviousUse,
				landClearingMethod: plantationMoreDetail.landClearingMethod,
				plantationName: plantationMoreDetail.name
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
			validationSchema={UpdatePlantationSchema}
			onSubmit={(values) => {
				setPlantationEditData({
					name: values.plantationName,
					management: {
						type: values.managementType,
						concessionCompany: values.concessionCompany ? values.concessionCompany : 'N/A',
						otherDetails: values.other ? values.other : 'N/A',
					},
					buyerAssociation: {
						type: values.associationType,
						plasma: values.plasma ? values.plasma : 'N/A',
						mill: values.mill ? values.mill : 'N/A',
						agreement: values.agreement ? values.agreement : 'N/A'
					},
					certification: values.certificationType,
					sizeDeclared: values.sizeDeclared,
					age: values.plantationAge,
					treesPlanted: values.treesPlanted,
					treesProductive: values.treesProductive,
					aveMonthlyYield: values.aveMonthlyYield,
					proofOfRights: values.proofOfRights,
					landPreviousUse: values.landPreviousUse,
					landClearingMethod: values.landClearingMethod,
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