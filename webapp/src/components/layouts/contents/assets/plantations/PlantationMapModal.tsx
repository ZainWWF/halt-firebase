import React, { Dispatch, SetStateAction, FunctionComponent } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationMapCard from "./PlantationMapCard";
import  useMediaQuery  from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationSummary, PlantationDetails } from '../../../../types/Plantation';

interface IProps {
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	setMapModalOpen: Dispatch<SetStateAction<boolean>>
	mapModalOpen: boolean
	plantationSummary: PlantationSummary | undefined
	plantationDetails: PlantationDetails | undefined
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	setRefreshGeometry: Dispatch<SetStateAction<boolean>>

}


const ModalView: FunctionComponent<IProps> = ({  setRefreshGeometry, mapModalOpen, setMapModalOpen, plantationSummary, plantationDetails ,setViewModalOpen, setHasError}) => {
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div>
      <Dialog disableBackdropClick={true} fullScreen={fullScreen} open={mapModalOpen} onClose={()=>setMapModalOpen(false)} aria-labelledby="view-modal-detail">
				<PlantationMapCard
					setRefreshGeometry={setRefreshGeometry}
					plantationSummary={plantationSummary} 
					plantationDetails={plantationDetails}
					mapModalOpen={mapModalOpen}
					setViewModalOpen={setViewModalOpen}
					setMapModalOpen={setMapModalOpen} 
					setHasError={setHasError}/>
      </Dialog>
    </div>
  );
}

export default ModalView;