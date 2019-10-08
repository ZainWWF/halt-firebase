import React, { useContext, Dispatch, SetStateAction, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form } from 'formik';
import MillContactFormFields from "./MillContactFormFields"
import * as Yup from "yup";
import { MillContactFormContext } from './MillContactForm';

type Props = {
	setNewMillContact: Dispatch<SetStateAction<any>>
}

export default function ScrollDialog(props: Props) {
	const { setNewMillContact } = props
	const { openMillContact, onCloseMillContact } = useContext(MillContactFormContext)
	const [checkBoxState, setCheckBoxState] = useState(false)


	const assistanceValidationSchema = Yup.object().shape({
		name: Yup.string()
			.required("Required"),
		phoneNumber: Yup.string()
			.required("Required")
	});

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth={"sm"}
				open={openMillContact}
				onClose={onCloseMillContact}
				scroll={"paper"}
				aria-labelledby="scroll-dialog-title"
			>
				<Formik
					initialValues={{
						name: "",
						phoneNumber: "",
						isAdmin: false // this field is actually not use
					}}
					validationSchema={assistanceValidationSchema}
					onSubmit={(values) => {
						setNewMillContact({
							name: values.name,
							phoneNumber: values.phoneNumber,
							isAdmin: checkBoxState
						})
					}}
				>
					{({ isValid, errors, touched }) => {
						return (
							<>
								<Form>
									<DialogTitle id="scroll-dialog-title">New Mill Contact</DialogTitle>
									<DialogContent dividers={true}>
										< MillContactFormFields
											errors={errors}
											touched={touched}
											setCheckBoxState={setCheckBoxState}
										/>

									</DialogContent>
									<DialogActions>
										<Button onClick={onCloseMillContact} color="primary">
											Cancel
          				</Button>
										<Button
											type="submit"
											color="primary"
											disabled={!isValid}
										>
											Submit
          				</Button>
									</DialogActions>
								</Form>
							</>
						)
					}}
				</Formik>
			</Dialog>
		</div >
	);
}