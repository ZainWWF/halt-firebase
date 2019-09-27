import React, { memo, FunctionComponent, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import VehicleDetailCard from "./VehicleDetailCard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { AssetContext } from "../AssetsContents";


const ModalView: FunctionComponent = memo(() => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

	const { stateAssetContext, dispatchAssetContext } = useContext(AssetContext)
	const onClose = () => dispatchAssetContext({ viewDetail: false })

	return (
		<div>
			<Dialog fullScreen={fullScreen}
				open={stateAssetContext.viewDetailState}
				onClose={onClose}
				aria-labelledby="view-modal-detail">
				<VehicleDetailCard />
			</Dialog>
		</div>
	);
})

export default ModalView