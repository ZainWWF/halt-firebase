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
		concessionCompany: string
		otherDetails: string
		type: string
	}
	name:  string
	proofOfRights: string
	sizeDeclared: number
	treesPlanted: number
	treesProductive: number
	userId?: string

}