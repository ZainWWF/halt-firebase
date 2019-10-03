
import * as admin from "firebase-admin";
import { BigQuery } from "@google-cloud/bigquery"
import schema from "./plantationSchema.json"
const bigquery = new BigQuery();
const dataset = bigquery.dataset('haltgisfiles');
const table = dataset.table('PlantationsUnaudited');

type UnAudited = {
	geoLocation: admin.firestore.GeoPoint,
	geometry: string,
	age: number,
	treesPlanted: number,
	treesProductive: number,
	aveMonthlyYield: number,
	landClearingMethod: number,
	management: Record<string, {}>,
	certification: Record<string, {}>,
	license: Record<string, {}>,
	previousLandCover: string

}

type Plantation = {
	userId: string
	name: string
	repIds?: string[] | null,
	auditAcceptedAt?: admin.firestore.Timestamp | null,
	createdAt: admin.firestore.Timestamp,
	updatedAt?: admin.firestore.Timestamp | null,
	auditAt: admin.firestore.Timestamp | null,
	auditBy: string | null,
	isActive: boolean
	isRemoved: boolean,
	unAudited: UnAudited
}

export default function (plantation: Plantation) {

	const {
		auditAcceptedAt,
		unAudited,
		userId,
		name,
		isActive,
		updatedAt,
		isRemoved } = plantation

	const {
		geometry,
		geoLocation,
		age,
		treesPlanted,
		treesProductive,
		aveMonthlyYield,
		landClearingMethod,
		management,
		certification,
		license,
		previousLandCover } = unAudited


	const initRow = {
		userId,
		name,
		isActive,
		isRemoved,
		age,
		treesPlanted,
		treesProductive,
		aveMonthlyYield,
		landClearingMethod,
		management,
		certification,
		license,
		previousLandCover
	}

	const point = {
		"type": "Point",
		"coordinates": [
			geoLocation.longitude,
			geoLocation.latitude
		]
	};
	const r1 = geoLocation ? { geoLocation: bigquery.geography(JSON.stringify(point)) } : {};
	const r2 = geometry ? { geometry: bigquery.geography(geometry) } : {};
	const r3 = auditAcceptedAt ? { updatedAt: bigquery.timestamp(auditAcceptedAt.toDate()) } : {};
	const r4 = updatedAt ? { TIMESTAMP: bigquery.timestamp(updatedAt.toDate()) } : {};



	const row = {
		...initRow,
		...r1,
		...r2,
		...r3,
		...r4,

	};

	console.log("insert row: ", row)
	
	
	table.insert(row, { schema })

		.then((data) => {
			console.log("insert result: ", data[0]);
		})
		.catch((err) => {
			console.error("insert error: ", JSON.stringify(err))
		});
}



