import React, { FunctionComponent, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlantationsEditForm from './PlantationsEditForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { PlantationAssetContext } from '../AssetsContents';
import { TransitionProps } from '@material-ui/core/transitions';
import { Fade } from '@material-ui/core';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
	return <Fade
		in={true}
		ref={ref} {...props}
		{...(true ? { timeout: 1000 } : {})} />
});


const ModalView: FunctionComponent = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { plantationEditModalOpenState, selectedPlantationDetailState } = statePlantationAssetContext!

	const onClose = () => dispatchPlantationAssetContext!({
		setPlantationEditModalOpen: {
			payload: false
		},
		setPlantationDetailsModalOpen: {
			payload: true
		}
	})

	return (selectedPlantationDetailState && Object.keys(selectedPlantationDetailState).length > 0 ?
		<>
			<Dialog 
				fullScreen={fullScreen}
				disableBackdropClick={true} 
				open={plantationEditModalOpenState!}
				onClose={onClose}
				TransitionComponent={Transition}
			>
				<DialogTitle id="form-dialog-title">Edit Plantation</DialogTitle>
				<PlantationsEditForm selectedPlantationDetailState={selectedPlantationDetailState} />
			</Dialog>
		</>
		:
		null
	)
}


export default ModalView