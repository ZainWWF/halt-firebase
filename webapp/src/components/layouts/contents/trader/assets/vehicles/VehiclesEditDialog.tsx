import React, { FunctionComponent, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import VehiclesEditForm from './VehiclesEditForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { VehicleAssetContext } from '../AssetsContents';


const FormDialog: FunctionComponent = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

	const { stateVehicleAssetContext, dispatchVehicleAssetContext } = useContext(VehicleAssetContext)
	const dialogOnClose = () => {
		dispatchVehicleAssetContext({ editDialog: false })
	}

	return (
		<div>
			<Dialog disableBackdropClick={true}  fullScreen={fullScreen} open={stateVehicleAssetContext.editDialogState} onClose={dialogOnClose} aria-labelledby="form-dialog-edit">
				<DialogTitle id="form-dialog-title">Edit Vehicle</DialogTitle>
				<VehiclesEditForm/>
			</Dialog>
		</div>
	);
}


export default FormDialog