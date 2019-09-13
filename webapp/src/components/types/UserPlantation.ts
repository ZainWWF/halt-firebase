import { firestore } from "firebase";

export type UserPlantation = {
 name : string
 management: {
	name : string
	type: string
	otherDetails: string
 }
 auditAcceptedAt: string | null,
 isActive: boolean
 ref: firestore.DocumentReference

}