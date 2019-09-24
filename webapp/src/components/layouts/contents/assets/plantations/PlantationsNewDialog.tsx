import React, { Dispatch, SetStateAction, FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlantationsNewForm from './PlantationsNewForm';
import  useMediaQuery  from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

interface IProps {
	setNewDialogOpen: Dispatch<SetStateAction<boolean>>
	newDialogOpen: boolean
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
	setPlantationFormData: Dispatch<SetStateAction<any>>
}

const FormDialog: FunctionComponent<IProps> = ({newDialogOpen, setNewDialogOpen, setPlantationFormData, setUploadInProgress}) =>{
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={newDialogOpen} onClose={()=>setNewDialogOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Plantation</DialogTitle>
						<PlantationsNewForm 
							setNewDialogOpen={setNewDialogOpen} 
							setPlantationFormData={setPlantationFormData}
							setUploadInProgress={setUploadInProgress}
						/>
      </Dialog>
    </div>
  );
}


export default FormDialog