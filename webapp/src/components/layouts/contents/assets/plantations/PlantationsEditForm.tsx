import React, { useState, Dispatch, SetStateAction, FunctionComponent, useEffect, useCallback } from "react";
import { Formik } from "formik";
import { PlantationDoc, PlantationDetails } from '../../../../types/Plantation';
import plantationValidationSchema from "./plantationValidationSchema";
import * as turfHelpers from "@turf/helpers";
import * as turfPointInPolygon from "@turf/boolean-point-in-polygon";
import * as SumatraMapBounds from "../../../../../config/PlantationMapBounds.json"
import * as firebase from 'firebase/app';
import PlantationForm from "./PlantationForm";

interface IProps {
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	plantationDoc: PlantationDoc | undefined
	setPlantationEditData: Dispatch<SetStateAction<{ unAudited: PlantationDetails, name: string }>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const DialogForm: FunctionComponent<IProps> = ({ setEditDialogOpen, setViewModalOpen, plantationDoc, setPlantationEditData }) => {

	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()
	const [enteredValues, setEnteredValues] = useState({
		...plantationDoc!.unAudited, geoLocation: {
			latitude: plantationDoc!.unAudited.geoLocation!.latitude,
			longitude: plantationDoc!.unAudited.geoLocation!.longitude
		}
	});

	const dialogOnCancel = () => {
		setEditDialogOpen(false);
		setViewModalOpen(true);
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


	useEffect(() => {
		if (plantationDoc) {
			if (plantationDoc.unAudited.management.type === "Pribadi") {
				plantationDoc.unAudited.management.name = ""
				plantationDoc.unAudited.management.rep = ""
				plantationDoc.unAudited.management.contact = ""
				plantationDoc.unAudited.management.detail = ""
			}

			if (plantationDoc.unAudited.management.type !== "Lainnya") {
				plantationDoc.unAudited.management.detail = ""
			}

			if (plantationDoc.unAudited.certification.type !== "Lainnya") {
				plantationDoc.unAudited.certification.detail = ""
			}

			// if (plantationDoc.unAudited.license.area <= 25) {
			// 	plantationDoc.unAudited.license.type = ""
			// 	plantationDoc.unAudited.license.detail = ""
			// }

			// if (plantationDoc.unAudited.license.type !== "Lainnya") {
			// 	plantationDoc.unAudited.license.detail = ""
			// }

			if (plantationDoc.unAudited.previousLandCover.type !== "Lainnya") {
				plantationDoc.unAudited.previousLandCover.detail = ""
			}

		}

	}, [plantationDoc])

	return (
		<Formik
			initialValues={{
				geoLocation: {
					latitude: plantationDoc!.unAudited.geoLocation!.latitude,
					longitude: plantationDoc!.unAudited.geoLocation!.longitude,
				},
				management: {
					type: plantationDoc!.unAudited.management.type,
					name: plantationDoc!.unAudited.management.name,
					rep: plantationDoc!.unAudited.management.rep,
					contact: plantationDoc!.unAudited.management.contact,
					detail: plantationDoc!.unAudited.management.detail,
				},
				certification: {
					type: plantationDoc!.unAudited.certification.type,
					detail: plantationDoc!.unAudited.certification.detail,
					serial: plantationDoc!.unAudited.certification.serial
				},
				// license: {
				// 	area: plantationDoc!.unAudited.license.area,
				// 	type: plantationDoc!.unAudited.license.type,
				// 	detail: plantationDoc!.unAudited.license.detail
				// },
				previousLandCover: {
					type: plantationDoc!.unAudited.previousLandCover.type,
					detail: plantationDoc!.unAudited.previousLandCover.detail
				},
				age: plantationDoc!.unAudited.age,
				treesPlanted: plantationDoc!.unAudited.treesPlanted,
				treesProductive: plantationDoc!.unAudited.treesProductive,
				aveMonthlyYield: plantationDoc!.unAudited.aveMonthlyYield,
				landClearingMethod: plantationDoc!.unAudited.landClearingMethod,
				plantationName: plantationDoc!.name
			}}
			validate={values => {
				setEnteredValues({ ...values })
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

				// if (values.license.area <= 25) {
				// 	values.license.type = ""
				// 	values.license.detail = ""
				// }

				// if (values.license.type !== "Lainnya") {
				// 	values.license.detail = ""
				// }

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
				setPlantationEditData({
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
						// license: {
						// 	area: Number(values.license.area),
						// 	type: values.license.type.length > 0 ? values.license.type : 'N/A',
						// 	detail: values.license.detail.length > 0 ? values.license.detail : 'N/A'
						// },
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
				setEditDialogOpen(false)
			}}
		>
			{({ isValid, errors, touched }) =>
				< PlantationForm
					errors={errors}
					touched={touched}
					isValid={isValid}
					enteredValues={enteredValues}
					dialogOnCancel={dialogOnCancel} />
			}
		</Formik>
	);
}

export default DialogForm;
