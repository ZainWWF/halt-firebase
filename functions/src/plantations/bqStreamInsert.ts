
import * as admin from "firebase-admin";
import { BigQuery, Geography } from "@google-cloud/bigquery"
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
	harvestMonthly: number,
	landClearingMethod: number,
	management: Record<string, {}>,
	certification: Record<string, {}>,
	license: Record<string, {}>
	previousLandCover,

}

type Plantation = {
	userId: string
	name: string
	repIds?: string[] | null,
	auditAcceptedAt: admin.firestore.Timestamp | null,
	createdAt: admin.firestore.Timestamp,
	updatedAt?: admin.firestore.Timestamp | null,
	auditAt: admin.firestore.Timestamp | null,
	auditBy: string | null,
	isActive: boolean
	isRemoved: boolean,
	unAudited: UnAudited
}

export default async function (plantation: Plantation) {
	try {

		const {
			unAudited,
			userId, name,
			auditAcceptedAt,
			isActive,
			createdAt,
			updatedAt,
			isRemoved } = plantation

		const {
			geometry,
			geoLocation,
			age,
			treesPlanted,
			treesProductive,
			harvestMonthly,
			landClearingMethod,
			management,
			certification,
			license,
			previousLandCover } = unAudited

		console.log("geometry:  ", geometry)
		let geometryGeogragphy: Geography | null = null
		if (geometry) {
			geometryGeogragphy = bigquery.geography(geometry)
		}

		let locationGeogragphy: Geography | null = null
		if (geoLocation) {
			const point = {
				"type": "Point",
				"coordinates": [
					geoLocation.longitude,
					geoLocation.longitude
				]
			}
			locationGeogragphy = bigquery.geography(JSON.stringify(point))
		}


		const row = {
			userId,
			name,
			auditAcceptedAt,
			isActive,
			createdAt,
			updatedAt,
			isRemoved,
			geoLocation: locationGeogragphy,
			geometry: geometryGeogragphy,
			age,
			treesPlanted,
			treesProductive,
			harvestMonthly,
			landClearingMethod,
			management,
			certification,
			license,
			previousLandCover
		}

		const result = await table.insert(row, { schema });
		console.log("stream insert result: ", result)

		return

	} catch (error) {
		
		console.log("stream error: " + error)
		console.log("stream error stringify: " + JSON.stringify(error))

		return "Error: " + error

	}

}