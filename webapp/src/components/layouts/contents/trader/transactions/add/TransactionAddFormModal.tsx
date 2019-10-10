import React, { useContext, useRef, Dispatch, SetStateAction, useState, useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form } from 'formik';
import { TransactionAddFormContext } from "./TransactionAddFormRequests"
import TransactionAddFormFields from "./TransactionAddFormFields"
import * as SumatraMapBounds from "../../../../../../config/PlantationMapBounds.json"
import * as turfHelpers from "@turf/helpers";
import * as turfPointInPolygon from "@turf/boolean-point-in-polygon";
import { FirebaseContext, Firebase } from "../../../../../providers/Firebase/FirebaseProvider";
import * as firebase from 'firebase/app';
import * as Yup from "yup";
import TransactioAddTable from "./TransactionAddTable"
import { DialogContentText } from '@material-ui/core';
import { AuthContext } from "../../../../../containers/Main";
import { string } from 'prop-types';


type Vehicle = {
	license: string
	model: string
	make: {
		detail: string
		type: string
	}
}

type AmountSource = {
	amount: string
	origin: string
}

type TransactionType = "Sell" | "Buy";

type Profile = {
	name: string
	phoneNumber: string
	photoUrl: string
}


export default function ScrollDialog() {

	const { openDialog, onCloseDialog } = useContext(TransactionAddFormContext)
	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()
	const [amountSource, setAmountSource] = useState()
	const [submittedValues, submitValues] = useState()
	const user = useContext(AuthContext) as firebase.User;
	const { profileData, setNewTransactionAdd } = useContext(TransactionAddFormContext)
	const amountRef = useRef(null)

	// const { vehicles } = profileData;

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

	// submit the form with valid values
	// this is a hack as the submit button does not work
	// when  it <Form> is placed outside of <Dialog>
	// Placing it inside <Dialog> however will cause the
	// paper scroll not to work
	const onSubmitForm = (isValid: boolean) => () => {
		if (isValid && Boolean(submittedValues) && Boolean(profileData)) {
			const {
				transactionType,
				clientType,
				clientPhoneNumber,
				amount,
				transportationBy,
				vehicle,
			} = submittedValues

			const collectionPoint = getGetGeopoint(submittedValues.collectionPoint)
			const vehicleId = getVehicleId(profileData.vehicles, vehicle)
			const origins = getOrigins(amountSource)
			const contact = getContact(user, profileData.profile, transactionType)

			setNewTransactionAdd({
				transactionType,
				clientType,
				clientPhoneNumber,
				collectionPoint,
				transportationBy,
				vehicle,
				vehicleId,
				...contact,
				origins,
				amount
			})
		}
	}


	const validateTest = () => {
		console.log("validateTest", submittedValues, amountSource)
		if (!amountSource || !submittedValues) return ""

		const error = validateAmount(amountSource, submittedValues.amount)
		console.log(error)
	}

	const validationSchema = Yup.object().shape({
		transactionType: Yup.string()
			.required("Required"),

		clientType: Yup.string()
			.required("Required"),

		clientPhoneNumber: Yup.string()
			.required("Required"),

		amount: Yup.number().moreThan(0).required("Required"),

		transportationBy: Yup.string()
			.required("Required"),

		vehicle: Yup.string()
			.required("Required"),

	});

	return (


		<Formik
			initialValues={{
				transactionType: "",
				clientType: "",
				clientPhoneNumber: "",
				amount: 0,
				transportationBy: "",
				vehicle: "",
				collectionPoint: {
					latitude: 0,
					longitude: 0
				}
			}}
			validateOnChange={true}
			validate={values => {
				console.log(values)
				submitValues(values)



				const amountError = validateAmount(amountSource, values.amount)

				// validate collectionPoint
				let collectionPoint = turfHelpers.point([values.collectionPoint.longitude, values.collectionPoint.latitude])
				let geoLocationError = {};
				if (mapPolygonBounds && !turfPointInPolygon.default(collectionPoint, mapPolygonBounds)) {
					geoLocationError = {
						collectionPoint: {
							latitude: "not within bounds!",
							longitude: "not within bounds!"
						}
					}
				}
				const error = { ...geoLocationError, ...amountError }
				// const error = { ...geoLocationError}
				return error
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				// onSubmit does not work
				// created a hack with onClick
				console.log(values)
			}}
		>
			{({ isValid, errors, touched }) => {
				console.log(isValid, errors, touched)
				return (

					<Form  >
						<Dialog
							fullWidth={true}
							maxWidth={"sm"}
							open={openDialog}
							onClose={onCloseDialog}
							aria-labelledby="scroll-dialog-title"
						>
							<DialogTitle id="scroll-dialog-title">New Transaction</DialogTitle>
							<DialogContent dividers>
								<TransactionAddFormFields
									errors={errors}
									touched={touched}
									setAmountSource={setAmountSource}
									amountRef={amountRef}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={onCloseDialog} color="primary">
									Cancel
          				</Button>
								<Button
									onClick={onSubmitForm(isValid)}
									color="primary"
									disabled={!isValid && Boolean(touched) || !submittedValues}
								>
									Submit
          				</Button>
							</DialogActions>
						</Dialog>
					</Form>
				)
			}}
		</Formik >
	);
}


function getGetGeopoint(collectionPoint: { latitude: number, longitude: number }): firebase.firestore.GeoPoint {
	return new firebase.firestore.GeoPoint(
		collectionPoint.latitude,
		collectionPoint.longitude
	);
}


function getVehicleId(vehicles: Record<string, Vehicle>, submitted: string): string {
	const [vehicleId] = Object.keys(vehicles).filter((key: string) => {
		const regex = new RegExp(vehicles[key].license, `g`)
		return regex.test(submitted)
	})
	return vehicleId
}



function getOrigins(amountSource: AmountSource[]) {
	return amountSource.reduce((origins: any, source: any) => {
		const { amount, origin } = source;
		return { ...origins, [origin]: { amount: Number(amount) } }
	}, {})
}


function getContact(user: firebase.User, profile: Profile, transactionType: TransactionType) {
	if (transactionType === "Sell") {
		return {
			sellerId: user.uid,
			sellerName: profile.name
		}
	}
	else {
		return {
			buyerId: user.uid,
			buyerName: profile.name
		}
	}
}

function validateAmount(amountSource: AmountSource[], amount: number) {

	if (amountSource) {
		const total = amountSource.reduce((total: number, source: any) => {
			if (source.amount) {
				return total + Number(source.amount)
			}
			return total
		}, 0)

		if (total !== amount) {
			return { amount: "amount does not match the total of the source!" }
		}
	}

	return {}
}


/**
 * {plantations: {…}, profile: {…}, vehicles: {…}}
plantations:
EsaD7vSvV6fFQ6UUQ90m:
auditAcceptedAt: null
isActive: false
management: {contact: "sebutlah namaku", detail: "", name: "Aku", rep: "Dia", type: "Perusahaan"}
name: "In Bukan Ladang"
ref: DocumentReference {_key: DocumentKey, firestore: Firestore, _firestoreClient: FirestoreClient}
sortDate: Timestamp {seconds: 1570589266, nanoseconds: 713000000}
__proto__: Object
mCXVWXMRWzn3zpLtgHZN: {auditAcceptedAt: null, isActive: false, management: {…}, name: "Kebun  Taugeh", ref: DocumentReference, …}
nNLGdwHwujmOhzzayrhX: {auditAcceptedAt: null, isActive: false, management: {…}, name: "Kebun Pisang Haluman", ref: DocumentReference, …}
__proto__: Object
profile:
name: "Wak Kim"
phoneNumber: "+6596385906"
photoUrl: "https://firebasestorage.googleapis.com/v0/b/halt-app-dev.appspot.com/o/images%2F34b39f17-0e84-4e36-8000-edba91921f95?alt=media&token=c93a0152-a9d8-4b20-a5c3-3e80c20f79b6"
__proto__: Object
vehicles:
qPAWclOjoafzfeE74kIu: {license: "Hhh", make: {…}, model: "Tgiv", ref: DocumentReference, url: "https://firebasestorage.googleapis.com/v0/b/halt-a…=media&token=ff3ea82e-28c7-4a9e-8d86-dcbfa602cf0c"}
__proto__: Object
__proto__: Object
 */



/**
 * (2) [{…}, {…}]
0:
amount: "1"
origin: "EsaD7vSvV6fFQ6UUQ90m"
tableData: {id: 0}
__proto__: Object
1:
amount: "1"
origin: "mCXVWXMRWzn3zpLtgHZN"
tableData: {id: 1}
__proto__: Object
length: 2
__proto__: Array(0)
*/