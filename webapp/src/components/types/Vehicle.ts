import { firestore } from 'firebase';

export type VehicleSummary = {
	license: string;
	make: {
		type:string;
		detail:string;
	}
	model: string;
	ref: firestore.DocumentReference;
	url: string;
}

export type VehicleDoc = {
	colour: string;
	license: string;
	loadingCapacity: number;
	make: {
		type:string;
		detail:string;
	}
	model: string;
	url: string;

}

