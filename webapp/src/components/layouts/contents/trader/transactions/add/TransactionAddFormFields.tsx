import React, { FunctionComponent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Field } from "formik";
import SingleField from "../../../../fields/SingleField"
import SelectField from "../../../../fields/SelectField"
import TransactioAddTable from "../table/TransactionAddTable"
import { TransactionAddFormContext } from "./TransactionAddForm"
const TransactionType = [
	"Buy",
	"Sell",
]

const TransportationType = [
	"By Buyer",
	"By Seller"
]

const RecipientType = [
	"Agent",
	"Mill"
]

interface IProps {
	errors: { [key: string]: any },
	touched: { [key: string]: any }

}

const SimpleForm: FunctionComponent<IProps> = ({ errors, touched }) => {

	const { profileData } = useContext(TransactionAddFormContext)

	const [plantations, setPlantations] = useState();
	const [VehicleType, setVehicleType] = useState();

	useEffect(() => {
		if (profileData) {
			console.log(profileData)
			const plantationData = Object.keys(profileData.plantations).reduce((acc: any, key: any) => {
				return { ...acc, [key]: profileData.plantations[key].name }
			}, {})
			setPlantations(plantationData)

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

			<Field name="recipientType"
				as={SelectField}
				error={errors.recipientType}
				touched={errors.recipientType}
				type="text"
				label="Recipient Type"
				choices={RecipientType} />

			<Field name="recipient"
				as={SingleField}
				error={errors.recipient}
				touched={touched.recipient}
				type="text"
				label="Recipient" />

			<Field name="amount"
				as={SingleField}
				error={errors.amount}
				touched={touched.amount}
				type="number"
				label="Amount" />
			{plantations &&
				<TransactioAddTable plantations={plantations}/>
			}
			<br />

			<Field name="transportation"
				as={SelectField}
				error={errors.transportation}
				touched={errors.transportation}
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

		</>
	)
}


export default SimpleForm