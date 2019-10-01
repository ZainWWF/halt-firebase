import React, { FunctionComponent, memo } from "react";
import { Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { PlantationDetails } from '../../../../types/Plantation';
import { FormGroup, FormLabel, Card, CardContent, CardActions } from "@material-ui/core";
import SingleField from "../../../fields/SingleField"
import SelectField from "../../../fields/SelectField"
import {
	ManagementType,
	CertificationType,
	LicenseType,
	PreviousLandCoverType,
	LandClearingMethodType
} from "../../../../../config/plantationAnswerChoices";
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			margin: 50
		},
		formButton: {
			margin: "auto"
		},
		content: {
			backgroundColor: grey[100],
			overflow: "auto",
			maxHeight: 490,
			[theme.breakpoints.down('xs')]: {
				maxHeight: "86vh",
			},
		},
		card: {
			minWidth: 345,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				maxHeight: "100vh",
				width: "100vw"
			},
		},
	})
);

interface IProps {
	enteredValues: Omit<PlantationDetails, "name" | "ref" | "geoLocation">
	dialogOnCancel: () => void
	isValid: boolean
	errors: { [key: string]: any },
	touched: { [key: string]: any }

}

const PlantationForm: FunctionComponent<IProps> = memo(({ isValid, errors, touched, enteredValues, dialogOnCancel }) => {

	const classes = useStyles();

	return (
		<Form>
			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<FormGroup>
						<Field name="plantationName"
							as={SingleField}
							error={errors.plantationName}
							touched={touched.plantationName}
							type="text"
							label="Plantation Name" />
					</FormGroup>
					<br />
					<FormLabel component="legend">GeoLocation</FormLabel>
					<FormGroup>
						<Field
							name="geoLocation.latitude"
							as={SingleField}
							error={errors.geoLocation && errors.geoLocation.latitude}
							touched={touched.geoLocation && touched.geoLocation.latitude}
							type="number"
							label="latitude" />
						<Field
							name="geoLocation.longitude"
							as={SingleField}
							error={errors.geoLocation && errors.geoLocation.longitude}
							touched={touched.geoLocation && touched.geoLocation.longitude}
							type="number"
							label="longitude" />
					</FormGroup>
					<br />
					<FormLabel component="legend">Management</FormLabel>
					<FormGroup>
						<Field name="management.type"
							as={SelectField}
							error={errors.management && errors.management.type}
							touched={touched.management && touched.management.type}
							label="type"
							choices={ManagementType} />
						{enteredValues.management.type !== "Pribadi" &&
							<>
								{enteredValues.management.type === "Lainnya" &&
									<Field name="management.detail"
										as={SingleField}
										error={errors.management && errors.management.type}
										touched={touched.management && touched.management.type}
										type="text"
										abel="detail" />
								}
								<Field name="management.name"
									as={SingleField}
									error={errors.management && errors.management.name}
									touched={touched.management && touched.management.name}
									type="text"
									label="name" />
								<Field
									name="management.rep"
									as={SingleField}
									error={errors.management && errors.management.rep}
									touched={touched.management && touched.management.rep}
									type="text"
									label="representative" />
								<Field
									name="management.contact"
									as={SingleField}
									error={errors.management && errors.management.contact}
									touched={touched.management && touched.management.contact}
									type="text"
									label="contact" />
							</>
						}
					</FormGroup>
					<br />
					<FormLabel component="legend">Certification</FormLabel>
					<FormGroup>
						<Field name="certification.type"
							as={SelectField}
							error={errors.certification && errors.certification.type}
							touched={touched.certification && touched.certification.type}
							label="type"
							choices={CertificationType} />
						{enteredValues.certification.type === "Lainnya" &&
							<Field name="certification.detail"
								as={SingleField}
								error={errors.certification && errors.certification.detail}
								touched={touched.certification && touched.certification.detail}
								type="text"
								label="detail" />
						}
						<Field name="certification.serial"
							as={SingleField}
							error={errors.certification && errors.certification.serial}
							touched={touched.certification && touched.certification.serial}
							type="text"
							label="serial" />
					</FormGroup>
					<br />
					<FormLabel component="legend">License</FormLabel>
					<FormGroup>
						<Field name="license.area"
							as={SingleField}
							error={errors.license && errors.license.area}
							touched={touched.license && touched.license.area}
							type="number" label="area (hectares)" />
						{enteredValues.license.area > 25 &&
							<>
								<Field name="license.type"
									as={SelectField}
									error={errors.license && errors.license.type}
									touched={touched.license && touched.license.type}
									type="text"
									label="type"
									choices={LicenseType} />
								{enteredValues.license.type === "Lainnya" &&
									<Field name="license.detail"
										as={SingleField}
										error={errors.license && errors.license.detail}
										touched={touched.license && touched.license.detail}
										type="text"
										label="detail" />
								}
							</>
						}
					</FormGroup>
					<br />
					<FormLabel component="legend">Previous Land Cover</FormLabel>
					<FormGroup>
						<Field name="previousLandCover.type"
							as={SelectField}
							error={errors.previousLandCover && errors.previousLandCover.type}
							touched={touched.previousLandCover && touched.previousLandCover.type}
							type="text"
							label="type"
							choices={PreviousLandCoverType} />
						{enteredValues.previousLandCover.type === "Lainnya" &&
							<Field name="previousLandCover.detail"
								as={SingleField}
								error={errors.previousLandCover && errors.previousLandCover.detail}
								touched={touched.previousLandCover && touched.previousLandCover.detail}
								type="text"
								label="detail" />
						}
					</FormGroup>
					<br />
					<FormGroup>
						<FormLabel component="legend">Land Clearing Method</FormLabel>
						<Field name="landClearingMethod"
							as={SelectField}
							error={errors.landClearingMethod}
							touched={touched.landClearingMethod}
							type="text"
							label="type"
							choices={LandClearingMethodType} />
					</FormGroup>
					<br />
					<FormLabel component="legend">Yield</FormLabel>
					<FormGroup>
						<Field name="age"
							as={SingleField}
							error={errors.age}
							touched={touched.age}
							type="text"
							label="age" />
						<Field name="treesPlanted"
							as={SingleField}
							error={errors.treesPlanted}
							touched={touched.treesPlanted}
							type="text"
							label="treesPlanted" />
						<Field name="treesProductive"
							as={SingleField}
							error={errors.treesProductive}
							touched={touched.treesProductive}
							type="text"
							label="treesProductive" />
						<Field name="aveMonthlyYield"
							as={SingleField}
							error={errors.aveMonthlyYield}
							touched={touched.aveMonthlyYield}
							type="text"
							label="aveMonthlyYield" />
					</FormGroup>
				</CardContent>
				<CardActions >
					<Button variant="contained"
						data-testid="plantation-button-cancel"
						color="primary"
						className={classes.formButton}
						onClick={dialogOnCancel}
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
				</CardActions>
			</Card>
		</Form>
	)
})

export default PlantationForm