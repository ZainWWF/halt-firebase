
import * as admin from "firebase-admin";
import { BigQuery } from "@google-cloud/bigquery"
import schema from "./plantationSchema.json"
// import { stringify } from "wellknown"
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
		unAudited,
		userId,
		name,
		isActive,
		createdAt,
		isRemoved } = plantation

	const {
		// geometry,
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
		createdAt: bigquery.timestamp(createdAt.toDate()),
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

	// const r1 = geometry ? { geometry: stringify(JSON.parse(geometry)) } : {}
	const r1 = {}

	const point = {
		"type": "Point",
		"coordinates": [
			geoLocation.longitude,
			geoLocation.latitude
		]
	}
	const r2 = geoLocation ? { geoLocation: bigquery.geography(JSON.stringify(point)) } : {}


	table.insert({ ...initRow, ...r1, ...r2 }, { schema })

		.then((data) => {
			console.log("insert result: ", data[0]);
		})
		.catch((err) => {
			console.log("insert error: ", JSON.stringify(err))
		});
}



