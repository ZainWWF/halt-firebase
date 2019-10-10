import React, { FunctionComponent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Field, FormikErrors, FormikValues } from "formik";
import SingleField from "../../../../fields/SingleField"
import SingleFieldRef from "../../../../fields/SingleFieldRef"
import SelectField from "../../../../fields/SelectField"
import TransactioAddTable from "./TransactionAddTable"
import { TransactionAddFormContext } from "./TransactionAddFormRequests"
import { FormLabel } from "@material-ui/core";
const TransactionType = [
	"Buy",
	"Sell",
]

const TransportationType = [
	"Buyer",
	"Seller"
]

const ClientType = [
	"Agent",
	"Mill"
]

interface IProps {
	errors: { [key: string]: any },
	touched: { [key: string]: any }
	setAmountSource: Dispatch<SetStateAction<any>>
	amountRef: React.MutableRefObject<null>
}

const SimpleForm: FunctionComponent<IProps> = ({ amountRef, errors, touched, setAmountSource }) => {

	const { profileData } = useContext(TransactionAddFormContext)
	const [plantations, setPlantations] = useState();
	const [VehicleType, setVehicleType] = useState();


	useEffect(() => {
		if (profileData) {
			const plantationData = Object.keys(profileData.plantations).reduce((acc: any, key: any) => {
				return { ...acc, [key]: profileData.plantations[key].name }
			}, {})
			setPlantations({ holdings: "HOLDINGS", ...plantationData })

			const vehicleType = Object.keys(profileData.vehicles).map(key => {
				const { make, model, license } = profileData.vehicles[key]
				const m = make.type === "lainnya" ? make.detail : make.type
				return `${m} ${model} ${license}`
			})
			setVehicleType(vehicleType)

		}
	}, [profileData])

	return (
		<>
			<Field name="transactionType"
				as={SelectField}
				error={errors.transactionType}
				touched={errors.transactionType}
				type="text"
				label="Transaction Type"
				choices={TransactionType} />

			<Field name="clientType"
				as={SelectField}
				error={errors.clientType}
				touched={errors.clientType}
				type="text"
				label="Client Type"
				choices={ClientType} />

			<Field name="clientPhoneNumber"
				as={SingleField}
				error={errors.clientPhoneNumber}
				touched={touched.clientPhoneNumber}
				type="text"
				label="Client Phone Number" />

			<Field name="amount"
				as={SingleFieldRef}
				inputRef={amountRef}
				error={errors.amount}
				touched={touched.amount}
				type="number"
				label="Amount" />

			{plantations &&
				<TransactioAddTable plantations={plantations} setAmountSource={setAmountSource} amountRef={amountRef} />
			}
			<br />

			<Field name="transportationBy"
				as={SelectField}
				error={errors.transportationBy}
				touched={errors.transportationBy}
				type="text"
				label="Transportation"
				choices={TransportationType} />

			<Field name="vehicle"
				as={SelectField}
				error={errors.vehicle}
				touched={errors.vehicle}
				type="text"
				label="Vehicle"
				choices={VehicleType ? VehicleType : []} />
			<br />
			<FormLabel component="legend">Collection Point </FormLabel>
			<Field
				name="collectionPoint.latitude"
				as={SingleField}
				error={errors.collectionPoint && errors.collectionPoint.latitude}
				touched={touched.collectionPoint && touched.collectionPoint.latitude}
				type="number"
				label="latitude" />

			<Field
				name="collectionPoint.longitude"
				as={SingleField}
				error={errors.collectionPoint && errors.collectionPoint.longitude}
				touched={touched.collectionPoint && touched.collectionPoint.longitude}
				type="number"
				label="longitude" />

		</>
	)
}


export default SimpleForm


