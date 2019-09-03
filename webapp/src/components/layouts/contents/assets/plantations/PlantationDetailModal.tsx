import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationDetailCard from "./PlantationDetailCard";
import  useMediaQuery  from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Plantation } from "../../../../types/Plantation";
import { UserPlantation } from "../../../../types/UserPlantation";


interface IProps {
	viewModalOpen : boolean
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	plantationMoreDetail: Plantation
	setPlantationMoreDetail: Dispatch<SetStateAction<Plantation>>
	plantationModalDetail: UserPlantation
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>
}

const ModalView: FunctionComponent<IProps> = ({ viewModalOpen, setViewModalOpen, setMapModalOpen, plantationMoreDetail, setPlantationMoreDetail, plantationModalDetail, editPlantationCallback, removePlantationCallback, setHasError})=> {
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={viewModalOpen} onClose={()=>setViewModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationDetailCard 
					plantationModalDetail={plantationModalDetail} 
					editPlantationCallback={editPlantationCallback}
					plantationMoreDetail={plantationMoreDetail}
					setPlantationMoreDetail={setPlantationMoreDetail} 
					removePlantationCallback={removePlantationCallback} 
					setViewModalOpen={setViewModalOpen}
					setMapModalOpen={setMapModalOpen} 
					setHasError={setHasError}/>
      </Dialog>
    </div>
  );
}

export default ModalView