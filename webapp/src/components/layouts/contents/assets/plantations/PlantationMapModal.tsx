import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationMapCard from "./PlantationMapCard";
import  useMediaQuery  from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationDoc, PlantationSummary } from '../../../../types/Plantation';



interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	mapModalOpen: boolean
	setPlantationDoc: Dispatch<SetStateAction<PlantationDoc | undefined>>
	plantationSummary: PlantationSummary | undefined
	removePlantationCallback: (path: string) => void
	editPlantationCallback: (path: string) => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}


const ModalView: FunctionComponent<IProps> = ({mapModalOpen, setMapModalOpen, setPlantationDoc, plantationSummary, editPlantationCallback, removePlantationCallback,setViewModalOpen, setHasError}) => {
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div>
      <Dialog disableBackdropClick={true} fullScreen={fullScreen} open={mapModalOpen} onClose={()=>setMapModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationMapCard 
					plantationSummary={plantationSummary} 
					setPlantationDoc={setPlantationDoc} 
					mapModalOpen={mapModalOpen}
					setViewModalOpen={setViewModalOpen}
					setMapModalOpen={setMapModalOpen} 
					setHasError={setHasError}/>
      </Dialog>
    </div>
  );
}

export default ModalView;