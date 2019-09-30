import React, { FunctionComponent, memo, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationRepSearchForm from "./PlantationRepsSearchForm";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { PlantationAssetContext } from "../AssetsContents";
import { DialogContent, Fade } from "@material-ui/core";


const ModalView: FunctionComponent = memo(() => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedPlantationSummaryState } = statePlantationAssetContext

	const closeRepsCardAddModalOnClick = () => {
		dispatchPlantationAssetContext({ addRep: false })
	}

	return (

		<Dialog fullScreen={false} open={statePlantationAssetContext.addRepState} onClose={closeRepsCardAddModalOnClick} aria-labelledby="view-modal-detail">
			<DialogContent>

				<PlantationRepSearchForm
					closeRepsCardAddModalOnClick={closeRepsCardAddModalOnClick}
					selectedPlantationSummaryState={selectedPlantationSummaryState}
				/>

			</DialogContent>
		</Dialog >

	);
})

export default ModalView