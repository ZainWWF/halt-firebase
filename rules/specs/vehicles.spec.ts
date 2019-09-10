
import { expectExtend, setup, teardown } from "./helpers";
import { firestore } from "firebase";

describe('Vehicles rules', () => {
	let db: firestore.Firestore
	let ref: firestore.CollectionReference;

	afterAll(async () => {
		await teardown();
	})

	test('deny read/write when not unauthenticated', async () => {
		db = await setup(null, null);
		ref = db.collection('vehicles');
		await expectExtend(ref.get()).toDeny()
		await expectExtend(ref.add({})).toDeny()
	})

	test('allow only Owner read', async () => {
		db = await setup({ uid: "john123" }, {
			"vehicles/v456" :{
				userId: "john123"
			}
		});
		ref = db.collection('vehicles');
		await expectExtend(ref.doc("v456").get()).toAllow()
		await expectExtend(ref.doc("v123").get()).toDeny()
	})

	test('allow Owner create when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('vehicles')
		await expectExtend(ref.doc("v456").set(
			{
				userId : "john123",
				colour: "blue",
				license: "string",
			}
		)).toDeny()
		await expectExtend(ref.doc("v456").set(
			{
				userId : "john123",
				colour: "blue",
				license: "string",
				chassis: "string",
				model: "string",
				make: "string",
				url: "string"
			}
		)).toAllow()
	})


	test('only allow Owner to update all except userId when authenticated', async () => {
		db = await setup({ uid: "mike456" }, {
			"vehicles/v123" : {
				userId: "mike456",
				colour: "blue",
				license: "string",
				chassis: "string",
				model: "string",
				make: "string",
				url: "string"
			}
		});
		ref = db.collection('vehicles');
		await expectExtend(ref.doc("v123").update({
			userId: "mike456",
			colour: "red",
		})).toAllow()
		await expectExtend(ref.doc("v123").update({
			userId: "joe123",
			colour: "red"
		})).toDeny()
	})


	test('deny delete when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('vehicles')
		await expectExtend(ref.doc().delete()).toDeny()
	})
})