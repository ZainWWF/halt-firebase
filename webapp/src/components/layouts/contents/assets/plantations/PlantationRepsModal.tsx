import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationRepsCard from "./PlantationRepsCard";
import  useMediaQuery  from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationSummary, PlantationDetails } from '../../../../types/Plantation';


interface IProps {
	repsModalOpen : boolean 
	setRepsModalOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	plantationSummary: PlantationSummary | undefined
	plantationDetails : PlantationDetails | undefined
	plantationReps: string[] | undefined
	setPlantationReps: Dispatch<SetStateAction<string[] | undefined>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
}


const ModalView: FunctionComponent<IProps> = ({setPlantationReps, setViewModalOpen, repsModalOpen, setRepsModalOpen, plantationSummary,  plantationDetails, plantationReps, setHasError})=> {

	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={repsModalOpen} onClose={()=>setRepsModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationRepsCard 
					setPlantationReps={setPlantationReps}
					setRepsModalOpen={setRepsModalOpen}
					plantationSummary={plantationSummary}
					plantationDetails={plantationDetails}
					plantationReps={plantationReps}
					setViewModalOpen={setViewModalOpen}
					setHasError={setHasError}/>
      </Dialog>
    </div>
  );
}

export default ModalView