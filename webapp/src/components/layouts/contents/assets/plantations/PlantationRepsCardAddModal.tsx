import React, { FunctionComponent, memo, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import PlantationRepSearchForm from "./PlantationRepsSearchForm";
import { PlantationAssetContext } from "../AssetsContents";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";



type IProps = {
	match: any
}


const ModalView: FunctionComponent<IProps> = memo(({ match }) => {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
	const { statePlantationAssetContext, dispatchPlantationAssetContext } = useContext(PlantationAssetContext)

	const closeRepsCardAddModalOnClick = () => dispatchPlantationAssetContext!({
		setPlantationNewRepModalOpen: {
			payload: false
		},
		setPlantationRepsModalOpen: {
			payload: true
		}

	})
	return (

		<Dialog fullScreen={fullScreen} open={statePlantationAssetContext!.plantationNewRepModalOpenState!} onClose={closeRepsCardAddModalOnClick} aria-labelledby="view-modal-detail">
			<PlantationRepSearchForm match={match}/>
		</Dialog >

	);
})

export default ModalView