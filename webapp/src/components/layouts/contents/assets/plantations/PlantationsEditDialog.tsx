import React, { Dispatch, SetStateAction, FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlantationsEditForm from './PlantationsEditForm';
import  useMediaQuery  from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { PlantationDoc, PlantationDetails } from '../../../../types/Plantation';


interface IProps {
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	plantationDoc: PlantationDoc | undefined
	setPlantationEditData: Dispatch<SetStateAction< {unAudited: PlantationDetails ,name :string} >>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	editDialogOpen: boolean
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}


const FormDialog: FunctionComponent<IProps> = ({editDialogOpen, setEditDialogOpen, setViewModalOpen, plantationDoc, setPlantationEditData, setHasError, setUploadInProgress})=> {
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={editDialogOpen} onClose={()=>setEditDialogOpen(false)} aria-labelledby="form-dialog-edit">
        <DialogTitle id="form-dialog-title">Edit Plantation</DialogTitle>
						<PlantationsEditForm 
							setEditDialogOpen={setEditDialogOpen} 
							setViewModalOpen={setViewModalOpen}
							plantationDoc={plantationDoc}
							setPlantationEditData={setPlantationEditData}
							setHasError={setHasError}
							setUploadInProgress={setUploadInProgress}
						/>
      </Dialog>
    </div>
  );
}

export default FormDialog