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
	name:string
	repIds?: string[]
	ref: firestore.DocumentReference
	geometry?: string
	geoLocation?: firestore.GeoPoint
	management: {
		type: string
		name: string
		rep: string
		contact: string
		detail: string
	},
	certification: {
		type: string
		detail: string
		serial: string
	},
	license: {
		area: number
		type: string
		detail: string
	},
	previousLandCover: {
		type: string,
		detail: string
	},
	landClearingMethod: string
	age: number
	treesPlanted: number
	treesProductive: number
	aveMonthlyYield: number
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
	repOfId? : string
	repOfName?: string

}

export type PlantationRep = {

	name: string
	mobile: string

}