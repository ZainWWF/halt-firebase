import React, { FunctionComponent, Dispatch, SetStateAction } from "react";
import { Field } from "formik";
import SingleField from "../../../../fields/SingleField"
import CheckboxField from "../../../../fields/CheckboxField"



interface IProps {
	errors: { [key: string]: any },
	touched: { [key: string]: any }
	setCheckBoxState: Dispatch<SetStateAction<boolean>>
}



const SimpleForm: FunctionComponent<IProps> = ({ errors, touched, setCheckBoxState }) => {



	const [state, setState] = React.useState({
		admin: false
	});
	
	const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log("",event.target.checked, name)
		setState({ ...state, [name]: event.target.checked });
		// this is a hack
		setCheckBoxState(event.target.checked)
	};
	
	return (
		<>

				<Field 
				name="isAdmin"
				as={CheckboxField}
				state={state}
				onChange={handleChange("admin")}
				type="checkbox"
				value="admin"
				checked={state.admin}
				label="Admin" />			


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