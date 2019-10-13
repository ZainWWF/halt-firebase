import React, { FunctionComponent, Dispatch, SetStateAction } from "react";
import { Field } from "formik";
import SingleField from "../../../../fields/SingleField"
import SingleFieldRef from "../../../../fields/SingleFieldRef"
import SelectField from "../../../../fields/SelectField"
import TransactioAddTable from "./TransactionAddTable"

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
	plantations: Record<string, any>
	vehicleSelections: string[]
	millNameSelections: string[]
	selectedMillType: string
	collectionPointRequired: boolean
	vehicleRequired: boolean
	selectedTransactionType: string
}

const SimpleForm: FunctionComponent<IProps> = ({
	amountRef,
	errors,
	touched,
	setAmountSource,
	plantations,
	vehicleSelections,
	millNameSelections,
	selectedMillType,
	collectionPointRequired,
	vehicleRequired,
	selectedTransactionType
}) => {

	return (
		<>
			<Field name="transactionType"
				as={SelectField}
				error={errors.transactionType}
				touched={errors.transactionType}
				type="text"
				label="Transaction Type"
				choices={TransactionType} />

			<Field name="clientPhoneNumber"
				as={SingleField}
				error={errors.clientPhoneNumber}
				touched={touched.clientPhoneNumber}
				type="text"
				label="Client Phone Number" />

			<Field name="clientType"
				as={SelectField}
				error={errors.clientType}
				touched={errors.clientType}
				type="text"
				label="Client Type"
				choices={ClientType} />

			{selectedMillType === "Mill" &&

				<Field name="millName"
					as={SelectField}
					error={errors.millName}
					touched={errors.millName}
					type="text"
					label="MillName"
					choices={millNameSelections ? millNameSelections : ["..not available"]} />
			}

			<Field name="amount"
				as={SingleFieldRef}
				inputRef={amountRef}
				error={errors.amount}
				touched={touched.amount}
				type="number"
				label="Amount" />

			{plantations && selectedTransactionType === "Sell" &&
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

			{vehicleRequired &&
				<>
					<Field name="vehicle"
						as={SelectField}
						error={errors.vehicle}
						touched={errors.vehicle}
						type="text"
						label="Vehicle"
						choices={vehicleSelections ? vehicleSelections : ["...not avalailble"]} />
					<br />
				</>
			}

			<Field name="collectionPoint"
				as={SelectField}
				error={errors.collectionPoint}
				touched={errors.collectionPoint}
				type="text"
				label="Collection Point?"
				choices={["Yes", "No"]} />


			{collectionPointRequired &&
				<>
					<Field
						name="collectLocation.latitude"
						as={SingleField}
						error={errors.collectLocation && errors.collectLocation.latitude}
						touched={touched.collectLocation && touched.collectLocation.latitude}
						type="number"
						label="latitude" />

					<Field
						name="collectLocation.longitude"
						as={SingleField}
						error={errors.collectLocation && errors.collectLocation.longitude}
						touched={touched.collectLocation && touched.collectLocation.longitude}
						type="number"
						label="longitude" />
				</>
			}

		</>
	)
}


export default SimpleForm


