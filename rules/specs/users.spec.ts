
import { expectExtend, setup, teardown } from "./helpers";
import { firestore } from "firebase";

describe('Users rules', () => {
	let db: firestore.Firestore
	let ref: firestore.CollectionReference;

	afterAll(async () => {
		await teardown();
	})

	test('deny read/write when not unauthenticated', async () => {
		db = await setup(null, null);
		ref = db.collection('users');
		await expectExtend(ref.get()).toDeny()
		await expectExtend(ref.add({})).toDeny()
	})

	test('anyone allow to read when authenticated', async () => {
		db = await setup({ uid: "mike456" }, {
			"users/john123": {
				profile: {}
			}
		});
		ref = db.collection('users');
		await expectExtend(ref.doc("john123").get()).toAllow()
	})

	test('disallow create/delete when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('users')
		await expectExtend(ref.add({})).toDeny()
		await expectExtend(ref.doc().delete()).toDeny()
	})

	test('deny update if profile field has changed', async () => {
		db = await setup({ uid: "john123" }, {
			"users/john123": {
				profile: {}
			}
		});
		ref = db.collection('users');
		await expectExtend(ref.doc("john123").update({ profile: {
			dummy : null
		} })).toDeny()
		await expectExtend(ref.doc("john123").update({})).toAllow()
	})

	test('allow update if vehicles field has changed', async () => {
		db = await setup({ uid: "john123" }, {
			"users/john123": {
				vehicles: {},
				plantations: {},
				profile: {},
			}
		});
		ref = db.collection('users');
		await expectExtend(ref.doc("john123").update({ vehicles: {
			dummy : null
		} })).toAllow()
		await expectExtend(ref.doc("john123").update({ vehicles: {} })).toAllow()
	})

	test('deny update if plantations field has changed', async () => {
		db = await setup({ uid: "john123" }, { 
			"users/john123": {
				plantations: {}
			}
		});
		ref = db.collection('users');
		await expectExtend(ref.doc("john123").update({ plantations: {
			dummy : null
		} })).toDeny()
		await expectExtend(ref.doc("john123").update({ plantations: {} })).toAllow()
	})
})