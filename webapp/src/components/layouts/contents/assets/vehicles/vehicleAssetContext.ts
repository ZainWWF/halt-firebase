
import { VehicleDoc, VehicleSummary } from "../../../../types/Vehicle";

type VehicleAssetContextState = {
	newDialogState: boolean
	editDialogState: boolean
	viewDetailState: boolean
	selectedVehicleSummaryState: Partial<VehicleSummary>
	selectedVehicleDetailState: Partial<VehicleDoc>
	newVehicleDocState: Partial<VehicleDoc>
	uploadInProgressState: boolean
	removedVehicleIdState: string
}

type VehicleAssetContextAction = {
	newDialog: true | false
	editDialog: true | false
	viewDetail: true | false
	uploadInProgress: true | false
	selectedVehicleSummary: {}
	selectedVehicleDetail : {}
	newVehicleDoc: {}
	removedVehicleId: string
}

export const vehicleAssetContextReducer = (state: VehicleAssetContextState, action: VehicleAssetContextAction) => {

	return Object.keys(action).reduce((state, type) => {

		if (type === "newDialog") {
			return { ...state, newDialogState: action.newDialog }
		}
		if (type === "editDialog") {
			return { ...state, editDialogState: action.editDialog }
		}
		if (type === "viewDetail") {
			return { ...state, viewDetailState: action.viewDetail }
		}
		if (type === "selectedVehicleSummary") {
			return { ...state, selectedVehicleSummaryState: action.selectedVehicleSummary }
		}
		if (type === "newVehicleDoc") {
			return { ...state, newVehicleDocState: action.newVehicleDoc }
		}
		if (type === "uploadInProgress") {
			return { ...state, uploadInProgressState: action.uploadInProgress }
		}
		if (type === "removedVehicleId") {
			return { ...state, removedVehicleIdState: action.removedVehicleId }
		}
		if (type === "selectedVehicleDetail") {
			return { ...state, selectedVehicleDetailState: action.selectedVehicleDetail }
		}
		return state

	}, state)
}

export const initialVehicleState: VehicleAssetContextState = {
	newDialogState: false,
	editDialogState: false,
	viewDetailState: false,
	selectedVehicleSummaryState: {},
	newVehicleDocState: {},
	selectedVehicleDetailState: {},
	uploadInProgressState: false,
	removedVehicleIdState:  ""
}
