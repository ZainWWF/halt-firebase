import React, { FunctionComponent } from "react";
import { Field } from "formik";
import SingleField from "../../../../fields/SingleField"


interface IProps {
	errors: { [key: string]: any },
	touched: { [key: string]: any }
}

const SimpleForm: FunctionComponent<IProps> = ({ errors, touched }) => {
	return (
		<>
			<Field name="name"
				as={SingleField}
				error={errors.name}
				touched={touched.name}
				type="text"
				label="Name" />

			<Field name="phoneNumber"
				as={SingleField}
				error={errors.phoneNumber}
				touched={touched.phoneNumber}
				type="text"
				label="Phone Number" />
		</>
	)
}


export default SimpleForm