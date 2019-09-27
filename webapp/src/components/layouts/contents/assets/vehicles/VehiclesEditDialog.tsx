import React, { FunctionComponent, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import VehiclesEditForm from './VehiclesEditForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { AssetContext } from '../AssetsContents';


const FormDialog: FunctionComponent = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

	const { stateAssetContext, dispatchAssetContext } = useContext(AssetContext)
	const dialogOnClose = () => {
		dispatchAssetContext({ editDialog: false })
	}

	return (
		<div>
			<Dialog  fullScreen={fullScreen} open={stateAssetContext.editDialogState} onClose={dialogOnClose} aria-labelledby="form-dialog-edit">
				<DialogTitle id="form-dialog-title">Edit Vehicle</DialogTitle>
				<VehiclesEditForm/>
			</Dialog>
		</div>
	);
}


export default FormDialog