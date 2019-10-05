import React, { FunctionComponent } from "react";
import { Field } from "formik";
import SelectField from "../../fields/SelectField"
import SingleField from "../../fields/SingleField"

const AssistanceType = [
	"Boundary Update",
	"Transaction Error",
	"General Assistance",
]

interface IProps {
	errors: { [key: string]: any },
	touched: { [key: string]: any }
}

const SimpleForm: FunctionComponent<IProps> = ({ errors, touched }) => {
	return (
		<>
			<Field name="type"
				as={SelectField}
				error={errors.type}
				touched={errors.type}
				type="text"
				label="type"
				choices={AssistanceType} />

			<Field name="comment"
				as={SingleField}
				error={errors.comment}
				touched={touched.comment}
				type="text"
				label="comment" />
		</>
	)
}


export default SimpleForm