import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationDetailCard from "./PlantationDetailCard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationDoc, PlantationSummary,PlantationDetails } from '../../../../types/Plantation';


interface IProps {
	viewModalOpen: boolean
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setRepsModalOpen: Dispatch<SetStateAction<boolean>>
	plantationDetails: PlantationDetails | undefined
	setPlantationDoc: Dispatch<SetStateAction<PlantationDoc | undefined>>
	plantationSummary: PlantationSummary | undefined
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>
}

const ModalView: FunctionComponent<IProps> = ({ viewModalOpen, setViewModalOpen, setMapModalOpen, setRepsModalOpen, plantationDetails, setPlantationDoc, plantationSummary, editPlantationCallback, removePlantationCallback, setHasError }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

	return (
		<div>
			<Dialog fullScreen={fullScreen} open={viewModalOpen} onClose={() => setViewModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationDetailCard
					setViewModalOpen={setViewModalOpen}
					setMapModalOpen={setMapModalOpen}
					setRepsModalOpen={setRepsModalOpen}
					setPlantationDoc={setPlantationDoc}
					plantationSummary={plantationSummary}
					editPlantationCallback={editPlantationCallback}
					plantationDetails={plantationDetails}
					removePlantationCallback={removePlantationCallback}
				/>
			</Dialog>
		</div>
	);
}

export default ModalView