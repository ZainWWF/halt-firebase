import { firestore } from 'firebase';

export type VehicleSummary = {
	license: string;
	make: string;
	model: string;
	ref: firestore.DocumentReference;
	url: string;
}

export type VehicleDoc = {
	chassis : string;
	colour: string;
	license: string;
	loadingCapacity: number;
	make: string;
	model: string;
	url: string;

}

