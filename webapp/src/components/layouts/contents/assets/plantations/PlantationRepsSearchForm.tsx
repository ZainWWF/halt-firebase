import React, { FunctionComponent, useContext, useState } from "react";
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import * as firebase from 'firebase/app';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import 'firebase/firestore';
import { useFormikContext, Formik, Field } from "formik";
import * as Yup from "yup";
import AddIcon from '@material-ui/icons/Add';
import LinearProgress from '@material-ui/core/LinearProgress';
import debounce from 'just-debounce-it';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Typography, InputAdornment, Card, CardHeader, CardContent } from "@material-ui/core";
import { grey } from '@material-ui/core/colors';
import SearchField from "../../../fields/SearchField"
import SearchIcon from '@material-ui/icons/Search';
import { PlantationAssetContext } from "../AssetsContents";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		card: {
			minWidth: 345,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				height: "100vh",
				width: "100vw"
			},
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
		contentWrapper: {
			padding: '40px 16px',
			backgroundColor: "#f5f5f5",
		},
		content: {
			backgroundColor: grey[100],
		},

	}));


const AutoSave: FunctionComponent<{ debounceMs: number }> = ({ debounceMs }) => {

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
					<LinearProgress />
				</>
			}
		</>
	);
};

const ValidatePlantationRepSchema = Yup.lazy((value: any)=>{
	if(value.plantationRepPhoneNumber && value.plantationRepPhoneNumber.length === 3){
		return Yup.mixed()
	}else{
		return Yup.object().shape({
				plantationRepPhoneNumber: Yup.string()
					.matches(/^\+/, "require country code eg. +61")
					.matches(/^\+[0-9]{10,16}/, "number must be between 10 to 16 digits")
			});
		}
})

type IProps = {
	match: any
}


const DialogForm: FunctionComponent<IProps> = ({ match }) => {

	const classes = useStyles();

	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedPlantationDetailState } = statePlantationAssetContext!

	console.log(selectedPlantationDetailState)
	const [plantationNewRep, setPlantationNewRep] = useState();
	const firebaseApp = useContext(FirebaseContext) as Firebase;

	const addRep = (userId: string) => {
		selectedPlantationDetailState!.ref!.update({
			"repIds": firebase.firestore.FieldValue.arrayUnion(userId)
		}).then(() => {
			console.log("upload success")
			dispatchPlantationAssetContext!({
				setPlantationNewRepModalOpen: {
					payload: false
				},
				setPlantationRepsModalOpen: {
					payload: true
				},
				setPlantationDetailRefresh: {
					payload: true
				}
			})

		}).catch(error => console.log(error))

	}

	const closeRepsSearchOnClick = () => dispatchPlantationAssetContext!({
		setPlantationNewRepModalOpen: {
			payload: false
		},
		setPlantationRepsModalOpen: {
			payload: true
		}
	})

	return (
		<Card className={classes.card}>
			<CardHeader
				action={
					<IconButton aria-label="settings" onClick={closeRepsSearchOnClick}>
						<CloseIcon />
					</IconButton>
				}
				title={"Search Directory"}
				subheader={"Add New Rep"}
			/>
			<CardContent className={classes.content}>
				<Formik
					initialValues={{
						plantationRepPhoneNumber: "+61",
					}}
					validationSchema={ValidatePlantationRepSchema}
					validateOnChange={true}
					onSubmit={(values, { setSubmitting }) => {
				
						if (values.plantationRepPhoneNumber.length > 10) {
							return new Promise(resolve =>
								setTimeout(() => {
									firebaseApp.db.collection('users')
										.where("profile.phoneNumber", "==", values.plantationRepPhoneNumber)
										.get()
										.then((data) => {
											if (data && data.docs.length > 0) {
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
							<form onSubmit={props.handleSubmit}>
								<Field name="plantationRepPhoneNumber"
									as={SearchField}
									error={props.errors.plantationRepPhoneNumber}
									touched={props.touched.plantationRepPhoneNumber}
									type="search"
									label="Enter Mobile Number"
									autoFocus
									fullWidth
									startAdornment={
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									}
								/>
								<AutoSave debounceMs={300} />
							</form>
							{plantationNewRep ?
								<List className={classes.root}>
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
								</List>
								:
								<>
									{props.isValid && props.values.plantationRepPhoneNumber.length > 3 &&
										<div className={classes.contentWrapper}>
											<Typography color="textSecondary" align="center">
												No user found
									</Typography>
										</div>
									}
								</>
							}
						</>
						)
					}}
				</Formik>
			</CardContent>
		</Card>
	);
}

export default DialogForm;