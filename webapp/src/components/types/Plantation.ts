export type PlantationDoc = {
	name:  string
	isActive : boolean
	createdAt : string
	updateAt? : string
	repIds? : string[]
	auditAccepted? :  boolean,
	auditAcceptedAt:  string
	auditAt? : string
	auditBy? : string
	unAudited : Plantation
	audited? : Plantation
	userId?: string
}

export type Plantation = {
	age: number
	aveMonthlyYield: number
	buyerAssociation : {
		agreement: string
		mill: string
		plasma: string
		type : string
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

