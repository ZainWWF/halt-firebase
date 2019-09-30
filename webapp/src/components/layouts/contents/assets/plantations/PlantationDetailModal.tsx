import React, { memo, FunctionComponent, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationDetailCard from "./PlantationDetailCard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationAssetContext } from "../AssetsContents";
import { TransitionProps } from '@material-ui/core/transitions';
import {  Fade } from "@material-ui/core";

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
	return <Fade
		in={true}
		ref={ref} {...props}
		{...(true ? { timeout: 1000 } : {})}/>
});

const ModalView: FunctionComponent = memo(() => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { plantationDetailsModalOpenState, selectedPlantationDetailState } = statePlantationAssetContext!

	const onClose = () => dispatchPlantationAssetContext!({
		setPlantationDetailsModalOpen: {
			payload: false
		},
		selectPlantationId: {
			payload: null
		},
		selectPlantationDetail: {
			payload: null
		},
		selectRepProfiles: {
			payload: null
		}
	})

	return (selectedPlantationDetailState && Object.keys(selectedPlantationDetailState).length > 0 ?
		<>
			<Dialog fullScreen={fullScreen}
				open={plantationDetailsModalOpenState!}
				onClose={onClose}
				TransitionComponent={Transition}
			>
				<PlantationDetailCard selectedPlantationDetailState={selectedPlantationDetailState} />
			</Dialog>
		</>
		:
		null
	)
})

export default ModalView