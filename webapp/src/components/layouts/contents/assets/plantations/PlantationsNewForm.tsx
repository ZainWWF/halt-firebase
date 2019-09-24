import React, { useState, FunctionComponent, Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Formik } from "formik";
import * as SumatraMapBounds from "../../../../../config/PlantationMapBounds.json"
import plantationValidationSchema from "./plantationValidationSchema";
import * as turfHelpers from "@turf/helpers";
import * as turfPointInPolygon from "@turf/boolean-point-in-polygon";
import * as firebase from 'firebase/app';
import PlantationForm from "./PlantationForm";


const initialValues = {
	plantationName: "",
	geoLocation: {
		latitude: 0,
		longitude: 0
	},
	management: {
		type: "",
		name: "",
		rep: "",
		contact: "",
		detail: ""
	},
	certification: {
		type: "",
		detail: "",
		serial: ""
	},
	landClearingMethod: "",
	previousLandCover: {
		type: "",
		detail: ""
	},
	license: {
		area: 0,
		type: "",
		detail: ""
	},
	age: 0,
	treesPlanted: 0,
	treesProductive: 0,
	aveMonthlyYield: 0,
}

interface IProps {
	setNewDialogOpen: Dispatch<SetStateAction<boolean>>
	setPlantationFormData: Dispatch<SetStateAction<any>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const DialogForm: FunctionComponent<IProps> = ({ setNewDialogOpen, setPlantationFormData, setUploadInProgress }) => {

	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()
	const [enteredValues, setEnteredValues] = useState(initialValues);
	

	const dialogOnCancel = () => {
		setNewDialogOpen(false)
	}

	// initalise the drawable bounds for the polygon
	const initMapPolygonBound = () => {
		const { features: [{ geometry: { coordinates } }] } = SumatraMapBounds;
		const boundPolygon = turfHelpers.polygon(coordinates)
		setMapPolygonBounds(boundPolygon)
	}

	const initMapCallback = useCallback(() => {
		// initalise the drawable bounds for the polygon
		initMapPolygonBound()
	}, [])

	useEffect(() => {
		initMapCallback()
	}, [initMapCallback])


	return (
		<Formik
			initialValues={initialValues}
			validate={values => {
				setEnteredValues(values)
				if (values.management.type === "Pribadi") {
					values.management.name = ""
					values.management.rep = ""
					values.management.contact = ""
					values.management.detail = ""
				}

				if (values.management.type !== "Lainnya") {
					values.management.detail = ""
				}

				if (values.certification.type !== "Lainnya") {
					values.certification.detail = ""
				}

				if (values.license.area <= 25) {
					values.license.type = ""
					values.license.detail = ""
				}

				if (values.license.type !== "Lainnya") {
					values.license.detail = ""
				}

				if (values.previousLandCover.type !== "Lainnya") {
					values.previousLandCover.detail = ""
				}

				let geoLocation = turfHelpers.point([values.geoLocation.longitude, values.geoLocation.latitude])
				if (mapPolygonBounds && !turfPointInPolygon.default(geoLocation, mapPolygonBounds)) {
					return {
						geoLocation: {
							latitude: "not within bounds!",
							longitude: "not within bounds!"
						}
					}
				}

				return {}
			}}
			validationSchema={plantationValidationSchema}
			onSubmit={(values) => {
				setUploadInProgress(true)
				setPlantationFormData({
					name: values.plantationName,
					unAudited: {
						geoLocation: new firebase.firestore.GeoPoint(
							values.geoLocation.latitude,
							values.geoLocation.longitude
						),
						management: {
							type: values.management.type,
							name: values.management.name.length > 0 ? values.management.name : 'N/A',
							rep: values.management.rep.length > 0 ? values.management.rep : 'N/A',
							contact: values.management.contact.length > 0 ? values.management.contact : 'N/A',
							detail: values.management.detail.length > 0 ? values.management.detail : 'N/A'
						},
						certification: {
							type: values.certification.type,
							detail: values.certification.detail.length > 0 ? values.certification.detail : 'N/A',
							serial: values.certification.serial.length > 0 ? values.certification.serial : 'N/A'
						},
						license: {
							area: Number(values.license.area),
							type: values.license.type.length > 0 ? values.license.type : 'N/A',
							detail: values.license.detail.length > 0 ? values.license.detail : 'N/A'
						},
						previousLandCover: {
							type: values.previousLandCover.type,
							detail: values.previousLandCover.detail.length > 0 ? values.previousLandCover.detail : 'N/A'
						},
						landClearingMethod: values.landClearingMethod,
						age: Number(values.age),
						treesPlanted: Number(values.treesPlanted),
						treesProductive: Number(values.treesProductive),
						aveMonthlyYield: Number(values.aveMonthlyYield)
					}
				})
				setNewDialogOpen(false)

			}}
		>
			{({ isValid, errors, touched }) => {

				return (
					< PlantationForm
						errors={errors}
						touched={touched}
						isValid={isValid}
						enteredValues={enteredValues}
						dialogOnCancel={dialogOnCancel} />
				)
			}}
		</Formik>
	);
}

export default DialogForm;


