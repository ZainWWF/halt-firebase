import { firestore } from "firebase";

export type UserPlantation = {
 name : string
 owner: string
 ref: firestore.DocumentReference

}