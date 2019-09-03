import { firestore } from 'firebase';

export type UserVehicle = {
	license: string;
	make: string;
	ref: firestore.DocumentReference;
	url: string;
}