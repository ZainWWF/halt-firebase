
import { expectExtend, setup, teardown } from "./helpers";
import { firestore } from "firebase";

describe('Profiles rules', () => {
	let db: firestore.Firestore
	let ref: firestore.CollectionReference;

	afterAll(async () => {
		await teardown();
	})

	test('deny read/write when not unauthenticated', async () => {
		db = await setup(null, null);
		ref = db.collection('profiles');
		await expectExtend(ref.get()).toDeny()
		await expectExtend(ref.add({})).toDeny()
	})


	test('allow Owner create when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('profiles')
		await expectExtend(ref.doc("john123").set(
			{
				dummy : null
			}
		)).toAllow()
	})



	test('only allow Owner to read/update when authenticated', async () => {
		db = await setup({ uid: "mike456" }, {
			"profiles/john123": {
				dummy: {}
			},
			"profiles/mike456": {
				dummy: {}
			}
		});
		ref = db.collection('profiles');
		await expectExtend(ref.doc("john123").get()).toDeny()
		await expectExtend(ref.doc("john123").update({})).toDeny()
		await expectExtend(ref.doc("mike456").get()).toAllow()
		await expectExtend(ref.doc("mike456").update({
			dummy: null
		})).toAllow()
	})


	test('deny delete when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('profiles')
		await expectExtend(ref.doc().delete()).toDeny()
	})
})