
import  { expectExtend, setup, teardown } from "./helpers";
import { firestore } from "firebase";

describe('Database rules', () => {
	let db : firestore.Firestore
	let ref: firestore.CollectionReference;

	beforeAll(async () => {
		db = await setup(
			{ uid: "user" },
			{}
		);

		ref = db.collection('non existent collection');
	})

	afterAll( async ()=>{
		await teardown();
	})

	 test( 'fail when unauthorized to read/write a collection' , async()=>{
		 await expectExtend(ref.get()).toDeny()
		 await expectExtend(ref.add({})).toDeny()
	 })
})