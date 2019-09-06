import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"

describe("Plantation onCreate trigger", () => {
	let adminStub;

	beforeAll(async () => {
		// you can use `sinon.stub` instead
		adminStub = jest.spyOn(admin, "initializeApp");
	});

	afterAll(async () => {
		// clean things up
		adminStub.mockRestore();
		testEnv.cleanup();
	});

	it("should update Users/plantation when new Plantaton is created", async () => {
		const fakeUserId = `fakeUser${Date.now()}`;
		const fakePlantationID = `fakePlantation${Date.now()}`
		const fakeUserDocRef = admin
			.firestore()
			.doc(`/users/${fakeUserId}`)
		await fakeUserDocRef.set({
			plantations: {}
		})

		const wrapped = testEnv.wrap(api.plantationOnCreate);
		const plantationPath = `plantations/${fakePlantationID}`
		const fakePlantation = {
			fakeField: null,
			name: "fakePlantation",
			owner: "fakeOwner",
			management: "Cooperative",
			userId: fakeUserId
		}

		//create document ref
		const plantationDocRef = admin
			.firestore()
			.doc(plantationPath)

		// document snaphshot of new plantation
		const snap = testEnv.firestore
			.makeDocumentSnapshot(fakePlantation, plantationPath);

		await plantationDocRef.set(fakePlantation)


		await wrapped(snap, {
			params: {
				plantationId: fakePlantationID
			}
		});

		const createdPlantation = await plantationDocRef.get();
		const updatedUserPlantation = await fakeUserDocRef.get()

		expect(createdPlantation.data()).toHaveProperty("createdAt")
		expect(updatedUserPlantation.data()).toHaveProperty(`plantations.${fakePlantationID}`)

		// clean up
		await plantationDocRef.delete()
		await fakeUserDocRef.delete();

	});
});