import React, { useState, FunctionComponent, useCallback, useEffect, useContext } from "react";
import { Formik } from "formik";
import * as SumatraMapBounds from "../../../../../config/PlantationMapBounds.json"
import plantationValidationSchema from "./plantationValidationSchema";
import * as turfHelpers from "@turf/helpers";
import * as turfPointInPolygon from "@turf/boolean-point-in-polygon";
import * as firebase from 'firebase/app';
import PlantationForm from "./PlantationForm";
import { FirebaseContext, Firebase } from "../../../../providers/Firebase/FirebaseProvider";
import { AuthContext } from "../../../../containers/Main";
import { PlantationAssetContext } from "../AssetsContents";




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

const DialogForm: FunctionComponent = () => {

	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()
	const [enteredValues, setEnteredValues] = useState(initialValues);
	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const user = useContext(AuthContext) as firebase.User;
	const { dispatchPlantationAssetContext } = useContext(PlantationAssetContext)

	const dialogOnCancel = () => dispatchPlantationAssetContext!({
		setPlantationNewModalOpen: {
			payload: false
		},
	})

	const newPlantationUpload = (plantationDoc:any) => {

		firebaseApp.db.collection('plantations')
			.add({ ...plantationDoc, userId: user.uid })
			.then(() => {
				console.log("upload success")
				dispatchPlantationAssetContext!({
					setPlantationNewModalOpen: {
						payload: false
					},
				})
			}).catch((error) => {
				console.log(error)
				// setHasError(error)
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
				newPlantationUpload({
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
							type:  values.license.type,
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


