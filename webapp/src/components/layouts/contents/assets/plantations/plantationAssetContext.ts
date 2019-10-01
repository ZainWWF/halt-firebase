
import {  PlantationDetails } from "../../../../types/Plantation";

export type PlantationAssetContextState = {
	uploadInProgressState: boolean | undefined
	plantationDetailRefreshState: boolean | undefined
	plantationMapModalOpenState: boolean | undefined
	plantationNewModalOpenState: boolean | undefined
	plantationEditModalOpenState: boolean | undefined
	plantationDetailsModalOpenState: boolean | undefined
	plantationRepsModalOpenState: boolean | undefined
	plantationNewRepModalOpenState: boolean | undefined
	selectedPlantationIdState: string | null
	removedPlantationIdState: string | null
	selectedPlantationDetailState: Partial<PlantationDetails> | null
	selectedRepProfilesState: any[] | null
	plantationCollectionState: { [k: string]: any }
}

export type PlantationAssetContextAction = {

	uploadInProgress?: {
		payload: true | false
	}

	setPlantationDetailRefresh?: {
		payload: true | false
	}

	setPlantationMapModalOpen?: {
		payload: true | false
	}

	setPlantationNewModalOpen?: {
		payload: true | false
	}

	setPlantationEditModalOpen?: {
		payload: true | false
	}

	setPlantationDetailsModalOpen?: {
		payload: true | false
	}

	setPlantationRepsModalOpen?: {
		payload: true | false
	}

	setPlantationNewRepModalOpen?: {
		payload: true | false
	}

	selectPlantationId?: {
		payload: string | null
	}

	removePlantationId?: {
		payload: string | null
	}

	plantationCollection?: {
		payload: { [k: string]: any }
	},

	selectPlantationDetail?: {
		payload: Partial<PlantationDetails> | null
	}
	selectRepProfiles?: {
		payload: any[] | null
	}
}

export const plantationAssetContextReducer = (state: PlantationAssetContextState, action: PlantationAssetContextAction) => {
	
	return Object.keys(action).reduce((state, type) => {

		if (type === "uploadInProgress") {
			return { ...state, uploadInProgressState: action.uploadInProgress!.payload }
		}
		if (type === "selectPlantationDetail") {
			return { ...state, selectedPlantationDetailState: action.selectPlantationDetail!.payload }
		}
		if (type === "selectRepProfiles") {
			return { ...state, selectedRepProfilesState: action.selectRepProfiles!.payload }
		}
		if (type === "plantationCollection") {
			return { ...state, plantationCollectionState: action.plantationCollection!.payload }
		}
		if (type === "selectPlantationId") {
			return { ...state, selectedPlantationIdState: action.selectPlantationId!.payload }
		}
		if (type === "removePlantationId") {
			return { ...state, removedPlantationIdState: action.removePlantationId!.payload }
		}
		if (type === "setPlantationDetailsModalOpen") {
			return { ...state, plantationDetailsModalOpenState: action.setPlantationDetailsModalOpen!.payload }
		}
		if (type === "setPlantationRepsModalOpen") {
			return { ...state, plantationRepsModalOpenState: action.setPlantationRepsModalOpen!.payload }
		}
		if (type === "setPlantationNewRepModalOpen") {
			return { ...state, plantationNewRepModalOpenState: action.setPlantationNewRepModalOpen!.payload }
		}	
		if (type === "setPlantationEditModalOpen") {
			return { ...state, plantationEditModalOpenState: action.setPlantationEditModalOpen!.payload }
		}
		if (type === "setPlantationNewModalOpen") {
			return { ...state, plantationNewModalOpenState: action.setPlantationNewModalOpen!.payload }
		}
		if (type === "setPlantationMapModalOpen") {
			return { ...state, plantationMapModalOpenState: action.setPlantationMapModalOpen!.payload }
		}
		if (type === "setPlantationDetailRefresh") {
			return { ...state, plantationDetailRefreshState: action.setPlantationDetailRefresh!.payload }
		}
		return state

	}, state)
}

export const initialPlantationState: PlantationAssetContextState = {
	uploadInProgressState: false,
	plantationDetailRefreshState: true,
	selectedPlantationDetailState: {},
	selectedRepProfilesState: null,
	plantationCollectionState: {},
	selectedPlantationIdState: null,
	removedPlantationIdState: null,
	plantationDetailsModalOpenState: false,
	plantationEditModalOpenState: false,
	plantationNewModalOpenState: false,
	plantationMapModalOpenState: false,
	plantationRepsModalOpenState: false,
	plantationNewRepModalOpenState: false
}
