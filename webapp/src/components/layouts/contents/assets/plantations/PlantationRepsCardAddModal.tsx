import React, { Dispatch, SetStateAction, FunctionComponent, memo } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationRepSearchForm from "./PlantationRepsSearchForm";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import {  PlantationSummary, } from '../../../../types/Plantation';


interface IProps {
	repsAddModalOpen: boolean
	setRepsAddModalOpen: Dispatch<SetStateAction<boolean>>
	plantationSummary: PlantationSummary | undefined
	setPlantationReps: Dispatch<SetStateAction<string[] | undefined>>
}


const ModalView: FunctionComponent<IProps> =memo(({ plantationSummary, repsAddModalOpen, setRepsAddModalOpen,setPlantationReps }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));


	return (
		<div>
			<Dialog fullScreen={fullScreen} open={repsAddModalOpen} onClose={() => setRepsAddModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationRepSearchForm 
				setRepsAddModalOpen={setRepsAddModalOpen} 
				plantationSummary={plantationSummary} 
				setPlantationReps={setPlantationReps}
				/>
			</Dialog>
		</div>
	);
})

export default ModalView