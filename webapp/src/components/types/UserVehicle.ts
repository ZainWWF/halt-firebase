import { firestore } from 'firebase';

export type UserVehicle = {
	license: string;
	make: string;
	model: string;
	ref: firestore.DocumentReference;
	url: string;
}