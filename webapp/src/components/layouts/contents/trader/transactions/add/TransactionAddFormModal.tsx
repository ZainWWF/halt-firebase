import React, { useContext, useRef, useState, useEffect } from 'react';
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
import * as firebase from 'firebase/app';
import * as Yup from "yup";
import { AuthContext } from "../../../../../containers/Main";
import { PhoneNumberUtil } from "google-libphonenumber"
import { FirebaseContext, Firebase } from '../../../../../providers/Firebase/FirebaseProvider';


const phoneUtil = PhoneNumberUtil.getInstance()

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
type TransportationBy = "Seller" | "Buyer"

type Profile = {
	name: string
	phoneNumber: string
	photoUrl: string
}

type CollectionPoint = {
	latitude: string
	longitude: string
}

const validationSchema = Yup.object().shape({
	transactionType: Yup.string()
		.required("Required"),

	clientType: Yup.string()
		.required("Required"),

	clientPhoneNumber: Yup.string()
		.required("Required"),

	amount: Yup.number()
		.moreThan(0)
		.required("Required"),

	transportationBy: Yup.string()
		.required("Required"),

});

export default function ScrollDialog() {

	const firebaseApp = useContext(FirebaseContext) as Firebase;
	const { openDialog, onCloseDialog } = useContext(TransactionAddFormContext)
	const [amountSource, setAmountSource] = useState()
	const [submittedValues, submitValues] = useState()
	const [repsMill, setRepsMill] = useState()
	const [millRepSearchPhoneNumber, setMillRepSearchPhoneNumber] = useState()
	const user = useContext(AuthContext) as firebase.User;
	const { profileData, setNewTransactionAdd } = useContext(TransactionAddFormContext)
	const amountRef = useRef(null)
	const [plantations, setPlantations] = useState();
	const [vehicleSelections, setVehicleSelections] = useState();
	const [millNameSelections, setMillNameSelections] = useState();
	const [collectionPointRequired, setCollectionPointRequired] = useState(false);
	const [vehicleRequired, setVehicleRequired] = useState(false);

	useEffect(() => {
		if (millRepSearchPhoneNumber) {
			let isSubscribed = true
			firebaseApp.db.collection("millReps")
				.where("phoneNumber", "==", millRepSearchPhoneNumber)
				.get()
				.then(millRepSnap => {
					if (isSubscribed) {

						const mills = millRepSnap.docs.reduce((mills, repSnap) => {
							const rep = repSnap.data();
							return { ...mills, [rep.millName]: rep }
						}, {})
						console.log(mills)

						setRepsMill(mills)
						setMillNameSelections(Object.keys(mills))

					}
				})
				.catch((error: Error) => {
					console.error(error)
				})
			return () => { isSubscribed = false }
		}
	}, [millRepSearchPhoneNumber, firebaseApp])


	useEffect(() => {
		if (profileData) {
			if (profileData.plantations) {
				const plantationData = Object.keys(profileData.plantations).reduce((acc: any, key: any) => {
					return { ...acc, [key]: profileData.plantations[key].name }
				}, {})
				setPlantations({ holdings: "HOLDINGS", ...plantationData })
			}

			if (profileData.vehicles) {
				const vehicleType = Object.keys(profileData.vehicles).map(key => {
					const { make, model, license } = profileData.vehicles[key]
					const m = make.type === "lainnya" ? make.detail : make.type
					return `${m} ${model} ${license}`
				})
				setVehicleSelections(vehicleType)
			}
		}
	}, [profileData])

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
				collectionPointIsProvided,
				vehicle,
				millName,
			} = submittedValues

			const vehicleId = getVehicleId(profileData.vehicles, vehicle)
			const origins = getOrigins(amountSource, transactionType)
			const contact = getContact(user, profileData.profile, transactionType)
			const collectionPoint = collectionPointIsProvided ? { collectionPoint : submittedValues.collectionPoint } : {}

			setNewTransactionAdd({
				transactionType,
				clientType,
				clientPhoneNumber,
				transportationBy,
				...collectionPoint,
				millName,
				millId: millName.length > 0 ? repsMill[millName].millId : null,
				vehicle,
				vehicleId,
				...contact,
				origins,
				amount,
			})
		}
	}

	return (
		<Formik
			initialValues={{
				transactionType: "",
				millName: "",
				clientType: "",
				clientPhoneNumber: "",
				amount: 0,
				transportationBy: "",
				vehicle: "",
				collectionPointIsProvided: "No",
				collectionPoint: {
					latitude: "",
					longitude: ""
				}
			}}
			validateOnChange={true}
			validate={values => {

				// custom validation	
				const transactionType = values.transactionType as TransactionType
				const transportationBy = values.transportationBy as TransportationBy
				const amountError = validateAmount(amountSource, values.amount, transactionType)
				const phoneNumberError = validatePhoneNumber(values.clientPhoneNumber)
				const vehicleError = validateVehicle(transactionType, transportationBy, values.vehicle)
				const geoPointError = validateGeoPoint(values.collectionPoint)
				const error = { ...geoPointError, ...amountError, ...vehicleError, ...phoneNumberError }

				
				//phoneNumber required on client type 
				if (!phoneNumberError.clientPhoneNumber && values.clientType === "Mill") {
					setMillRepSearchPhoneNumber(values.clientPhoneNumber)
				} else {
					setMillRepSearchPhoneNumber(null)
				}

				// mill name reset on client type
				if (values.clientType !== "Mill") {
					values.millName = ""
				}

				const collectionPointIsProvided = values.collectionPointIsProvided === "Yes" ? true : false
				setCollectionPointRequired(collectionPointIsProvided)

				const firestoreGeoPoint = getFirestoreGeoPoint(values.collectionPoint)

				// reset vehicle value
				if ((transactionType === "Buy" && transportationBy === "Seller") ||
					(transactionType === "Sell" && transportationBy === "Buyer")) {
					values.vehicle = ""
				}

				// vehicle field show or hide
				vehicleError.vehicle || values.vehicle.length > 0 ? setVehicleRequired(true) : setVehicleRequired(false)

				// set values ready for submission to server
				submitValues({ ...values, collectionPointIsProvided, collectionPoint: firestoreGeoPoint })

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
									plantations={plantations}
									collectionPointRequired={collectionPointRequired}
									vehicleRequired={vehicleRequired}
									vehicleSelections={vehicleSelections}
									millNameSelections={millNameSelections}
									selectedTransactionType={submittedValues ? submittedValues.transactionType : null}
									selectedMillType={submittedValues ? submittedValues.clientType : null}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={onCloseDialog} color="primary">
									Cancel
          				</Button>
								<Button
									onClick={onSubmitForm(isValid)}
									color="primary"
									disabled={(!isValid && Boolean(touched)) || !submittedValues}
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

// parse vehicle license from the form and return the vehicle id
function getVehicleId(vehicles: Record<string, Vehicle>, submitted: string): string | null {

	if (!submitted || submitted.length === 0) return null

	const [vehicleId] = Object.keys(vehicles).filter((key: string) => {
		const regex = new RegExp(vehicles[key].license, `g`)
		return regex.test(submitted)
	})
	return vehicleId
}

// parse the origins from the form table and return a map of origins for upload
function getOrigins(amountSource: AmountSource[], transactionType: TransactionType) {
	if (transactionType === "Buy") return {}
	return amountSource.reduce((origins: any, source: any) => {
		const { amount, origin } = source;
		return { ...origins, [origin]: { amount: Number(amount) } }
	}, {})
}

// set the role of owner (Seller/Buyer) depending on the transaction type
function getContact(user: firebase.User, profile: Profile, transactionType: TransactionType) {

	if (transactionType === "Sell") {
		return {
			sellerId: user.uid,
			sellerName: profile.name ? profile.name : null
		}
	}
	else {
		return {
			buyerId: user.uid,
			buyerName: profile.name ? profile.name : null
		}
	}
}

// validate the amount if owner is selling that the amount is more than holdings
function validateAmount(amountSource: AmountSource[], amount: number, transactionType: string) {
	if (transactionType === "Buy") {
		return {}
	}

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


//  set vehicle field as required if transportation is by owner
function validateVehicle(transactionType: TransactionType, transportationBy: TransportationBy, vehicle: string) {

	if (transactionType === "Sell" && transportationBy === "Seller" && vehicle.length === 0) {
		return { vehicle: "vehicle is required" }
	}

	if (transactionType === "Buy" && transportationBy === "Buyer" && vehicle.length === 0) {
		return { vehicle: "vehicle is required" }
	}
	return {}
}

// validate collection point is within boundaries
function validateGeoPoint(collectionPoint: CollectionPoint) {

	const { features: [{ geometry: { coordinates } }] } = SumatraMapBounds;
	const boundPolygon = turfHelpers.polygon(coordinates)

	if (collectionPoint.latitude.length > 0 || collectionPoint.latitude.length > 0) {

		const geoPoint = getGeoPoint(collectionPoint)
		console.log(geoPoint)
		if (boundPolygon && !turfPointInPolygon.default(geoPoint, boundPolygon)) {
			return {
				collectionPoint: {
					latitude: "not within bounds!",
					longitude: "not within bounds!"
				}
			}
		}

	}

	return {}
}

// returm the Geojson point value of the collection Point
function getGeoPoint(collectionPoint: CollectionPoint) {
	const lng = collectionPoint.longitude.length === 0 ? 0 : Number(collectionPoint.longitude)
	const lat = collectionPoint.latitude.length === 0 ? 0 : Number(collectionPoint.latitude)

	return turfHelpers.point([lng, lat])
}

// return the Firebase Geopoint format for collection point
function getFirestoreGeoPoint(collectionPoint: any) {

	try {
		const geopoint = new firebase.firestore.GeoPoint(
			Number(collectionPoint.latitude),
			Number(collectionPoint.longitude))

		return geopoint

	} catch (error) {
		return { error }
	}
}



// validate the clients phone number
function validatePhoneNumber(phoneNumber: string) {
	try {
		phoneUtil.parseAndKeepRawInput(phoneNumber)
		return {}
	} catch (error) {
		return {
			clientPhoneNumber: error.message
		}
	}

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