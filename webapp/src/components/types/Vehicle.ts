import { firestore } from "firebase";

export type Vehicle = {
	chassis : string;
	colour: string;
	license: string;
	loadingCapacity: number;
	make: string;
	url: string;

}