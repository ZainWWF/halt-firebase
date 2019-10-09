import React, { useContext, Dispatch, SetStateAction, useState, useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form } from 'formik';
import { TransactionAddFormContext } from "./TransactionAddForm"
import TransactionAddFormFields from "./TransactionAddFormFields"
import * as SumatraMapBounds from "../../../../../../config/PlantationMapBounds.json"
import * as turfHelpers from "@turf/helpers";
import * as turfPointInPolygon from "@turf/boolean-point-in-polygon";
import * as Yup from "yup";
import TransactioAddTable from "../table/TransactionAddTable"
import { DialogContentText } from '@material-ui/core';


type Props = {
	setNewTransactionAdd: Dispatch<SetStateAction<any>>
}

export default function ScrollDialog(props: Props) {
	const { setNewTransactionAdd } = props
	const { openDialog, onCloseDialog } = useContext(TransactionAddFormContext)
	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()


	// initalise the drawable bounds for the polygon
	const initMapPolygonBound = () => {
		const { features: [{ geometry: { coordinates } }] } = SumatraMapBounds;
		const boundPolygon = turfHelpers.polygon(coordinates)
		setMapPolygonBounds(boundPolygon)
	}

	const initMapCallback = useCallback(() => {
		// initalise the drawable bounds for the polygon
		initMapPolygonBound()
	}, [])

	useEffect(() => {
		initMapCallback()
	}, [initMapCallback])


	const validationSchema = Yup.object().shape({
		transactionType: Yup.string()
			.required("Required"),

		recipientType: Yup.string()
			.required("Required"),

		recipient: Yup.string()
			.required("Required"),

		amount: Yup.number().moreThan(0),

		transportation: Yup.string()
			.required("Required"),

		vehicle: Yup.string()
			.required("Required"),

	});

	return (


		<Formik
			initialValues={{
				transactionType: "",
				recipientType: "",
				recipient: "",
				amount: 0,
				transportation: "",
				vehicle: "",
				geoLocation: {
					latitude: 0,
					longitude: 0
				}
			}}
			validate={values => {
				let geoLocation = turfHelpers.point([values.geoLocation.longitude, values.geoLocation.latitude])
				if (mapPolygonBounds && !turfPointInPolygon.default(geoLocation, mapPolygonBounds)) {
					return {
						geoLocation: {
							latitude: "not within bounds!",
							longitude: "not within bounds!"
						}
					}
				}
				return
			}}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				console.log(values)
				// setNewMillContact({
				// 	name: values.name,
				// 	phoneNumber: values.phoneNumber,
				// 	isAdmin: checkBoxState
				// })
			}}
		>
			{({ isValid, errors, touched }) => {
				return (
					<>
						<Form>
							<Dialog
								fullWidth={true}
								maxWidth={"sm"}
								open={openDialog}
								onClose={onCloseDialog}
								// scroll="paper"
								aria-labelledby="scroll-dialog-title"
								keepMounted
							>
								<DialogTitle id="scroll-dialog-title">New Transaction</DialogTitle>
								{/* <DialogActions>
										<TransactioAddTable/>
									</DialogActions> */}
								<DialogContent dividers>
									{/* <DialogContentText> */}
									<TransactionAddFormFields
										errors={errors}
										touched={touched}
									/>

									{/* </DialogContentText> */}

								</DialogContent>
								<DialogActions>
									<Button onClick={onCloseDialog} color="primary">
										Cancel
          				</Button>
									<Button
										type="submit"
										color="primary"
										disabled={!isValid && Boolean(touched)}
									>
										Submit
          				</Button>
								</DialogActions>
							</Dialog>
						</Form>
					</>
				)
			}}
		</Formik>
	);
}