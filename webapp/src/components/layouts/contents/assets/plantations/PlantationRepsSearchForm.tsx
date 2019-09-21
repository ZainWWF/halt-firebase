import React, { Dispatch, SetStateAction, FunctionComponent, useContext, useState } from "react";
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useFormikContext, Formik, Field } from "formik";
import * as Yup from "yup";
import DialogContent from "@material-ui/core/DialogContent";
import AddIcon from '@material-ui/icons/Add';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from "@material-ui/core/styles";
import PlantationRepSearchField from "./PlantationRepSearchField";
import debounce from 'just-debounce-it';
import { ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { grey } from '@material-ui/core/colors';
import { PlantationSummary } from "../../../../types/Plantation";



const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
	form: {
		margin: 50
	},
	repList: {
		backgroundColor: "#f5f5f5",
	},
	addIcon: {
		top: "55%",
		right: 30
	},
	bigAvatar: {
		margin: 10,
		width: 60,
		height: 60,
		backgroundColor: grey[500],
	},

});


const AutoSave: FunctionComponent<{ debounceMs: number }> = ({ debounceMs }) => {

	const classes = useStyles();
	const formik = useFormikContext();
	const debouncedSubmit = React.useCallback(
		debounce(
			() =>
				formik.submitForm().then(() => { }),
			debounceMs
		),
		[debounceMs, formik.submitForm]
	);

	React.useEffect(() => {
		debouncedSubmit();
	}, [debouncedSubmit, formik.values]);

	return (
		<>
			{!!formik.isSubmitting
				&&
				<>
					<div className={classes.root}>
						<LinearProgress />
					</div>
				</>
			}
		</>
	);
};


const ValidatePlantationRepSchema = Yup.object().shape({
	plantationRepPhoneNumber: Yup.string()
		.matches(/^\+/, "require country code eg. +61")
		.matches(/^\+[0-9]{10,16}/, "number must be between 10 to 16 digits")
});

interface IProps {
	setRepsAddModalOpen: Dispatch<SetStateAction<boolean>>
	plantationSummary: PlantationSummary | undefined
	setPlantationReps: Dispatch<SetStateAction<string[]| undefined>>
}


const DialogForm: FunctionComponent<IProps> = ({ setRepsAddModalOpen, plantationSummary, setPlantationReps }) => {
	const classes = useStyles();
	const [plantationNewRep, setPlantationNewRep] = useState();
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const addRep =  (userId: string) => {
		plantationSummary!.ref.update({
			"repIds": firebase.firestore.FieldValue.arrayUnion(userId) 
		}).then(()=>{
			setRepsAddModalOpen(false)
		    	plantationSummary!.ref.get().then(doc=>{
						if(doc){
							console.log(doc.data())
							setPlantationReps(doc.data()!.repIds)
						}

					}).catch(error=>console.log(error))
		}).catch(error=>console.log(error))


	}

	return (
		<Formik
			initialValues={{
				plantationRepPhoneNumber: "",
			}}
			validationSchema={ValidatePlantationRepSchema}
			validateOnChange={true}
			onSubmit={(values, { setSubmitting }) => {
				console.log(values)
				if (values.plantationRepPhoneNumber.length > 0) {
					return new Promise(resolve =>
						setTimeout(() => {
							firebaseApp.db.collection('users')
								.where("profile.phoneNumber", "==", values.plantationRepPhoneNumber)
								.get()
								.then((data) => {
									if (data) {
										console.log(data.docs[0])
										setPlantationNewRep({ ...data.docs[0].data().profile, userId: data.docs[0].id })
									} else {
										setPlantationNewRep(null)
									}
									setSubmitting(false);
									resolve();
								})
								.catch(error => {
									console.log(error)
									setPlantationNewRep(null)
									setSubmitting(false);
									resolve();
								})
						}, 1000)
					);
				} else {
					setPlantationNewRep(null)
				}

			}}
		>
			{(props) => {
				return (<>
					<AutoSave debounceMs={300} />
					<form onSubmit={props.handleSubmit}>
						<DialogContent>
							<Field as
								name="plantationRepPhoneNumber" value={props.values.plantationRepPhoneNumber} onChange={props.handleChange} component={PlantationRepSearchField}
							/>
						</DialogContent>
					</form>
					{plantationNewRep && <>
						<ListItem key={plantationNewRep.userId} id={plantationNewRep.userId} className={classes.repList}>
							<ListItemAvatar>
								<Avatar alt={""} src={plantationNewRep.photoUrl} className={classes.bigAvatar}>
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={plantationNewRep.phoneNumber} secondary={plantationNewRep.name} />
							<ListItemSecondaryAction className={classes.addIcon}>
								<IconButton aria-label="add" onClick={() => addRep(plantationNewRep.userId)}>
									<AddIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					</>
					}
				</>
				)
			}}
		</Formik>
	);
}

export default DialogForm;