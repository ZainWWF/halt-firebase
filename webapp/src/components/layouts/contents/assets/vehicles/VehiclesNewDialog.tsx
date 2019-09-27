import React, { FunctionComponent, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import VehiclesNewForm from './VehiclesNewForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { AssetContext } from '../AssetsContents';

const FormDialog: FunctionComponent = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

	const { stateAssetContext, dispatchAssetContext } = useContext(AssetContext)
	const dialogOnClose = () => {
		dispatchAssetContext({ newDialog: false })
	}

	return (
		<div>
			<Dialog disableBackdropClick={true} fullScreen={fullScreen} onClose={dialogOnClose} open={stateAssetContext.newDialogState} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Add Vehicle</DialogTitle>
				<VehiclesNewForm />
			</Dialog>
		</div>
	);
}

export default FormDialog