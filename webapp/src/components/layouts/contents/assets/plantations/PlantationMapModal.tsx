import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationMapCard from "./PlantationMapCard";
import  useMediaQuery  from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Plantation } from "../../../../types/Plantation";
import { UserPlantation } from "../../../../types/UserPlantation";


interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	mapModalOpen: boolean
	plantationMoreDetail: Plantation
	setPlantationMoreDetail: Dispatch<SetStateAction<Plantation>>
	plantationModalDetail: UserPlantation
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}


const ModalView: FunctionComponent<IProps> = ({mapModalOpen, setMapModalOpen,plantationMoreDetail, setPlantationMoreDetail, plantationModalDetail, editPlantationCallback, removePlantationCallback,setViewModalOpen, setHasError}) => {
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div>
      <Dialog disableBackdropClick={true} fullScreen={fullScreen} open={mapModalOpen} onClose={()=>setMapModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationMapCard 
					plantationModalDetail={plantationModalDetail} 
					setPlantationMoreDetail={setPlantationMoreDetail} 
					mapModalOpen={mapModalOpen}
					setViewModalOpen={setViewModalOpen}
					setMapModalOpen={setMapModalOpen} 
					setHasError={setHasError}/>
      </Dialog>
    </div>
  );
}

export default ModalView;