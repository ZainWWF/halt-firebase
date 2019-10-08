import React, { useContext, Dispatch, SetStateAction } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form } from 'formik';
import MillAdminFormFields from "./MillAdminFormFields"
import * as Yup from "yup";
import { MillAdminFormContext } from './MillAdminForm';

type Props = {
	setNewMillAdmin: Dispatch<SetStateAction<any>>
}

export default function ScrollDialog(props: Props) {
	const { setNewMillAdmin } = props
	const { openMillAdmin, onCloseMillAdmin } = useContext(MillAdminFormContext)
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
				open={openMillAdmin}
				onClose={onCloseMillAdmin}
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
						setNewMillAdmin(values)
					}}
				>
					{({ isValid, errors, touched }) => {
						return (
							<>
								<Form>
									<DialogTitle id="scroll-dialog-title">New Mill Admin</DialogTitle>
									<DialogContent dividers={true}>
										< MillAdminFormFields
											errors={errors}
											touched={touched}
										/>

									</DialogContent>
									<DialogActions>
										<Button onClick={onCloseMillAdmin} color="primary">
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