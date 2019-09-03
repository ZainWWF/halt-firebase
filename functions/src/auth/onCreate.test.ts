import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index" 

describe("auth functions", () => {
  let adminStub

  beforeAll(() => {
    // you can use `sinon.stub` instead
    adminStub = jest.spyOn(admin, "initializeApp");
  });

  afterAll(async() => {
    // clean things up
    adminStub.mockRestore();
    testEnv.cleanup();
  });

  it("should store user in db on Auth", async () => {
    const wrapped = testEnv.wrap(api.authOnCreate);

    const fakeUser = {
      uid: `fakeUser${Date.now()}`
    };

    await wrapped(fakeUser);

		const userDocRef = admin
		.firestore()
		.doc(`/users/${fakeUser.uid}`)

    const createdUser = await userDocRef.get()
		expect(createdUser.exists).toEqual(true)

		// clean up	
		await userDocRef.delete();
		
  });
});