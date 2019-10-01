import React, { FunctionComponent, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationRepsCard from "./PlantationRepsCard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationAssetContext } from "../AssetsContents";
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

	const { statePlantationAssetContext } = useContext(PlantationAssetContext)
	const { plantationRepsModalOpenState, selectedPlantationDetailState } = statePlantationAssetContext!

	return (
		selectedPlantationDetailState && Object.keys(selectedPlantationDetailState).length > 0 ?
		<>
			<Dialog
				fullScreen={fullScreen}
				disableBackdropClick={true}
				open={plantationRepsModalOpenState!}
				TransitionComponent={Transition}
			>
				<PlantationRepsCard/>
			</Dialog>
		</>
		:
		null
	)

}

export default ModalView

