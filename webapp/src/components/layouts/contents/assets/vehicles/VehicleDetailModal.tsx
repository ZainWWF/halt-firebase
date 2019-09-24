import React, { memo,FunctionComponent, SetStateAction, Dispatch } from "react";
import Dialog from "@material-ui/core/Dialog";
import VehicleDetailCard from "./VehicleDetailCard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { VehicleSummary, VehicleDoc } from '../../../../types/Vehicle';



interface IProps {
	viewModalOpen : boolean
	setViewModalOpen: Dispatch<SetStateAction<boolean>>
	vehicleMoreDetail: VehicleDoc
	setVehicleMoreDetail: Dispatch<SetStateAction<VehicleDoc>>
	vehicleModalDetail: VehicleSummary
	removeVehicleCallback: (path: string) => void
	editVehicleCallback: () => void
	setHasError: Dispatch<SetStateAction<Error | undefined>>


}

const ModalView: FunctionComponent<IProps> = memo(({ viewModalOpen, setViewModalOpen, vehicleMoreDetail, setVehicleMoreDetail, vehicleModalDetail, editVehicleCallback, removeVehicleCallback, setHasError }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

	return (
		<div>
			<Dialog fullScreen={fullScreen} open={viewModalOpen} onClose={() => setViewModalOpen(false)} aria-labelledby="view-modal-detail">
				<VehicleDetailCard
					vehicleModalDetail={vehicleModalDetail}
					editVehicleCallback={editVehicleCallback}
					vehicleMoreDetail={vehicleMoreDetail}
					setVehicleMoreDetail={setVehicleMoreDetail}
					removeVehicleCallback={removeVehicleCallback}
					setViewModalOpen={setViewModalOpen}
					setHasError={setHasError} />
			</Dialog>
		</div>
	);
})

export default ModalView