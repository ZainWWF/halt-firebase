
import { expectExtend, setup, teardown } from "./helpers";
import { firestore } from "firebase";

describe('Plantations rules', () => {
	let db: firestore.Firestore
	let ref: firestore.CollectionReference;

	afterAll(async () => {
		await teardown();
	})

	test('deny read/write when not unauthenticated', async () => {
		db = await setup(null, null);
		ref = db.collection('plantations');
		await expectExtend(ref.get()).toDeny()
		await expectExtend(ref.add({})).toDeny()
	})

	test('allow only Owner read', async () => {
		db = await setup({ uid: "john123" }, {
			"plantations/v456" :{
				userId: "john123"
			}
		});
		ref = db.collection('plantations');
		await expectExtend(ref.doc("v456").get()).toAllow()
		await expectExtend(ref.doc("v123").get()).toDeny()
	})

	test.only('allow Owner create when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('plantations')
		await expectExtend(ref.doc("v456").set(
			{
				userId: "john123",
				name: "abc",
				unAudited : {
					management: {
						type: "aaa",
						name: "aaa",
						otherDetails: "aaa",
					},
					buyerAssociation: {
						type: "aaa",
						plasma: "aaa",
						mill: "aaa",
						agreement: "aaa"
					},
					certification: "aaa",
					area: 111,
					age: 111,
					treesPlanted: 111,
					treesProductive: 111,
					aveMonthlyYield: 111,
					proofOfRights: "aaa",
					landPreviousUse: "aaa",
					landClearingMethod: "aaa",
				}
			}
		)).toAllow()
	})


	test('only allow Owner to update all except userId when authenticated', async () => {
		db = await setup({ uid: "mike456" }, {
			"plantations/v123" : {
				userId: "mike456",
				colour: "blue"
			}
		});
		ref = db.collection('plantations');
		await expectExtend(ref.doc("v123").update({
			userId: "mike456",
			name: "red"
		})).toAllow()
		await expectExtend(ref.doc("v123").update({
			userId: "joe123",
			name: "red"
		})).toDeny()
	})


	test('deny delete when authenticated', async () => {
		db = await setup({ uid: "john123" }, {});
		ref = db.collection('plantations')
		await expectExtend(ref.doc().delete()).toDeny()
	})
})