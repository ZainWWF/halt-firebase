import React, { useContext, Dispatch, SetStateAction } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form } from 'formik';
import MillRepFormFields from "./MillRepFormFields"
import * as Yup from "yup";
import { MillRepFormContext } from './MillRepForm';

type Props = {
	setNewMillRep: Dispatch<SetStateAction<any>>
}

export default function ScrollDialog(props: Props) {
	const { setNewMillRep } = props
	const { openMillRep, onCloseMillRep } = useContext(MillRepFormContext)
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
				open={openMillRep}
				onClose={onCloseMillRep}
				scroll={"paper"}
				aria-labelledby="scroll-dialog-title"
			>
				<Formik
					initialValues={{
						name: "",
						phoneNumber: ""
					}}
					validationSchema={assistanceValidationSchema}
					onSubmit={(values) => {
						setNewMillRep(values)
					}}
				>
					{({ isValid, errors, touched }) => {
						return (
							<>
								<Form>
									<DialogTitle id="scroll-dialog-title">New Mill Rep</DialogTitle>
									<DialogContent dividers={true}>
										< MillRepFormFields
											errors={errors}
											touched={touched}
										/>

									</DialogContent>
									<DialogActions>
										<Button onClick={onCloseMillRep} color="primary">
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