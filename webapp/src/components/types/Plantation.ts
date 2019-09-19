import { firestore } from "firebase";
export type PlantationDoc = {
	name: string
	isActive: boolean
	createdAt: string
	updateAt?: string
	repIds?: string[]
	auditAccepted?: boolean
	auditAcceptedAt: string
	auditAt?: string
	auditBy?: string
	unAudited: PlantationDetails
	audited?: PlantationDetails
	userId?: string
}


export type PlantationDetails = {
	age: number
	geometry: string
	aveMonthlyYield: number
	buyerAssociation: {
		agreement: string
		mill: string
		plasma: string
		type: string
	}
	certification: string
	landClearingMethod: string
	landPreviousUse: string
	management: {
		name: string
		otherDetails: string
		type: string
	}
	proofOfRights: string
	area: number
	treesPlanted: number
	treesProductive: number

}

export type PlantationSummary = {
	name: string
	management: {
		name: string
		type: string
		otherDetails: string
	}
	auditAcceptedAt: string | null,
	isActive: boolean
	ref: firestore.DocumentReference

}

export type PlantationRep = {

	name: string
	mobile: string

}