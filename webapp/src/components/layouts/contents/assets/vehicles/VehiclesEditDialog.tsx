import React, { FunctionComponent, Dispatch, SetStateAction } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import VehiclesEditForm from './VehiclesEditForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Vehicle } from '../../../../types/Vehicle';


interface IProps {
	setEditDialogOpen: Dispatch<SetStateAction<boolean>>
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	vehicleMoreDetail: Vehicle
	setVehicleEditData: Dispatch<SetStateAction<Vehicle>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>
	editDialogOpen: boolean
	setUploadInProgress: Dispatch<SetStateAction<boolean>>
}

const FormDialog: FunctionComponent<IProps> = ({ editDialogOpen, setEditDialogOpen, setViewModalOpen, vehicleMoreDetail, setVehicleEditData, setHasError, setUploadInProgress }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

	return (
		<div>
			<Dialog fullScreen={fullScreen} open={editDialogOpen} onClose={() => setEditDialogOpen(false)} aria-labelledby="form-dialog-edit">
				<DialogTitle id="form-dialog-title">Edit Vehicle</DialogTitle>
				<VehiclesEditForm
					setEditDialogOpen={setEditDialogOpen}
					setViewModalOpen={setViewModalOpen}
					vehicleMoreDetail={vehicleMoreDetail}
					setVehicleEditData={setVehicleEditData}
					setHasError={setHasError}
					setUploadInProgress={setUploadInProgress}
				/>
			</Dialog>
		</div>
	);
}


export default FormDialog