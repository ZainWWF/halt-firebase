import React, { FunctionComponent, useContext, useState, useEffect,memo } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationRepsCard from "./PlantationRepsCard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationAssetContext } from "../AssetsContents";
import { PlantationDoc } from "../../../../types/Plantation";
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import * as firebase from 'firebase/app';
import 'firebase/firestore';


type IProps ={
	setRepsModelOpen: any
	repsModalOpen:any
	setDetailsModelOpen:any
}
const ModalView: FunctionComponent<IProps> = memo(({repsModalOpen,setRepsModelOpen,setDetailsModelOpen}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
	// const firebaseApp = useContext(FirebaseContext) as Firebase;
	// const [repProfiles, setRepProfiles] = useState<any[]>([])
	// const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	
	console.log("render")
	// setDetailsModelOpen(false)
	const dialogOnClose = () => setRepsModelOpen(false)
	
	// {
		// dispatchPlantationAssetContext({ viewRep: false })
	// }

	return (
		<div>
			<Dialog disableBackdropClick={true}
				fullScreen={fullScreen}
				onClose={dialogOnClose}
				open={repsModalOpen}
				aria-labelledby="form-dialog-title">
				<PlantationRepsCard
				setDetailsModelOpen={setDetailsModelOpen}
					// repProfiles={repProfiles}
					// selectedPlantationDetail={selectedPlantationDetail}
					// statePlantationAssetContext={statePlantationAssetContext}
					// dispatchPlantationAssetContext={dispatchPlantationAssetContext}

				/>
			</Dialog>
		</div>
	);
})

export default ModalView

