import React, { useContext, Dispatch, SetStateAction } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form } from 'formik';
import AssistanceFormFields from "./AssistanceFormFields"
import * as Yup from "yup";
import { AssistanceFormContext } from './AssistanceForm';

type Props = {
	setAssistanceRequest:Dispatch<SetStateAction<any>>
}

export default function ScrollDialog(props: Props) {
	const { setAssistanceRequest } = props
	const {openAssistance,onCloseAssistance } = useContext(AssistanceFormContext)
	const assistanceValidationSchema = Yup.object().shape({
		type: Yup.string()
			.required("Required")
	});

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth={"sm"}
				open={openAssistance}
				onClose={onCloseAssistance}
				scroll={"paper"}
				aria-labelledby="scroll-dialog-title"
			>
				<Formik
					initialValues={{
						type: "",
						comment: ""
					}}
					validationSchema={assistanceValidationSchema}
					onSubmit={(values) => {
						setAssistanceRequest(values)
					}}
				>
					{({ isValid, errors, touched }) => {
						return (
							<>
								<Form>
									<DialogTitle id="scroll-dialog-title">Request Assistance</DialogTitle>
									<DialogContent dividers={true}>
										< AssistanceFormFields
											errors={errors}
											touched={touched}
										/>

									</DialogContent>
									<DialogActions>
										<Button onClick={onCloseAssistance} color="primary">
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
		</div>
	);
}