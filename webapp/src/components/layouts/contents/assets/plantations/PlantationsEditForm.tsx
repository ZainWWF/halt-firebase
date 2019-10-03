import React, { useState, FunctionComponent, useEffect, useCallback, useContext } from "react";
import { Formik } from "formik";
import plantationValidationSchema from "./plantationValidationSchema";
import * as turfHelpers from "@turf/helpers";
import * as turfPointInPolygon from "@turf/boolean-point-in-polygon";
import * as SumatraMapBounds from "../../../../../config/PlantationMapBounds.json"
import * as firebase from 'firebase/app';
import PlantationForm from "./PlantationForm";
import { PlantationAssetContext } from "../AssetsContents";
import { Grid, CircularProgress } from "@material-ui/core";


type IProps = {
	selectedPlantationDetailState: any
}


const EditForm: FunctionComponent<IProps> = ({ selectedPlantationDetailState }) => {
	
	const { dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const [ selectedPlantationDetail, setSelectedPlantationDetail] = useState(selectedPlantationDetailState);
	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()

	const editedPlantationUpload = (plantationDoc: any) => {

		selectedPlantationDetailState.ref.update(plantationDoc)
			.then(() => {
				console.log("upload success")
				dispatchPlantationAssetContext!({
					selectPlantationDetail: {
						payload: null
					},
					setPlantationEditModalOpen: {
						payload: false
					},
					setPlantationDetailRefresh: {
						payload: true
					}
				})
			}).catch((error: Error) => {
				console.log(error)
				// setHasError(error)
			})
	}

	const dialogOnCancel = () => {
		dispatchPlantationAssetContext!({
			setPlantationEditModalOpen: {
				payload: false
			}
		})
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
		if (selectedPlantationDetailState) {
			if (selectedPlantationDetailState.management.type === "Pribadi") {
				selectedPlantationDetailState.management.name = ""
				selectedPlantationDetailState.management.rep = ""
				selectedPlantationDetailState.management.contact = ""
				selectedPlantationDetailState.management.detail = ""
			}

			if (selectedPlantationDetailState.management.type !== "Lainnya") {
				selectedPlantationDetailState.management.detail = ""
			}

			if (selectedPlantationDetailState.certification.type !== "Lainnya") {
				selectedPlantationDetailState.certification.detail = ""
			}

			if (selectedPlantationDetailState.license.area <= 25) {
				selectedPlantationDetailState.license.type = ""
				selectedPlantationDetailState.license.detail = ""
			}

			if (selectedPlantationDetailState.license.type !== "Lainnya") {
				selectedPlantationDetailState.license.detail = ""
			}

			if (selectedPlantationDetailState.previousLandCover.type !== "Lainnya") {
				selectedPlantationDetailState.previousLandCover.detail = ""
			}
		}

	}, [selectedPlantationDetailState])

	return (selectedPlantationDetailState ?

		<Formik
			initialValues={{
				geoLocation: {
					latitude: selectedPlantationDetailState.geoLocation.latitude,
					longitude: selectedPlantationDetailState.geoLocation.longitude,
				},
				management: {
					type: selectedPlantationDetailState.management.type,
					name: selectedPlantationDetailState.management.name,
					rep: selectedPlantationDetailState.management.rep,
					contact: selectedPlantationDetailState.management.contact,
					detail: selectedPlantationDetailState.management.detail,
				},
				certification: {
					type: selectedPlantationDetailState.certification.type,
					detail: selectedPlantationDetailState.certification.detail,
					serial: selectedPlantationDetailState.certification.serial
				},
				license: {
					area: selectedPlantationDetailState.license.area,
					type: selectedPlantationDetailState.license.type,
					detail: selectedPlantationDetailState.license.detail
				},
				previousLandCover: {
					type: selectedPlantationDetailState.previousLandCover.type,
					detail: selectedPlantationDetailState.previousLandCover.detail
				},
				age: selectedPlantationDetailState.age,
				treesPlanted: selectedPlantationDetailState.treesPlanted,
				treesProductive: selectedPlantationDetailState.treesProductive,
				aveMonthlyYield: selectedPlantationDetailState.aveMonthlyYield,
				landClearingMethod: selectedPlantationDetailState.landClearingMethod,
				plantationName: selectedPlantationDetailState.name
			}}
			validate={values => {
				setSelectedPlantationDetail({ ...values })
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
				editedPlantationUpload({
					name: values.plantationName,
					unAudited: {
						geoLocation: new firebase.firestore.GeoPoint(
							values.geoLocation.latitude,
							values.geoLocation.longitude
						),
						management: values.management,
						certification: values.certification,
						license: {
							area: Number(values.license.area),
							type: values.license.type,
							detail: values.license.detail
						},
						previousLandCover: values.previousLandCover,
						landClearingMethod: values.landClearingMethod,
						age: Number(values.age),
						treesPlanted: Number(values.treesPlanted),
						treesProductive: Number(values.treesProductive),
						aveMonthlyYield: Number(values.aveMonthlyYield)
					}
				})
			}}
		>
			{({ isValid, errors, touched }) =>
				< PlantationForm
					errors={errors}
					touched={touched}
					isValid={isValid}
					enteredValues={selectedPlantationDetail}
					dialogOnCancel={dialogOnCancel} />
			}
		</Formik>
		:
		<Grid
			container
			justify="center"
			alignItems="center"
			style={{ height: 100, width: 140, margin: "auto", paddingBottom: 20 }}
		>
			<CircularProgress />
		</Grid>

	);
}

export default EditForm;
