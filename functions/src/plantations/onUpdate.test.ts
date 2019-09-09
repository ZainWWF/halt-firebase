import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"
// tslint:disable-next-line: no-implicit-dependencies
import waitForExpect from "wait-for-expect";

describe("Plantation onUpdate trigger", () => {
	// jest.setTimeout(12000);
	let adminStub,
		fakeUserId,
		fakePlantationID,
		plantationPath,
		editedPlantationRef,
		editedPlantation,
		userPath,
		userRef,
		editedUser;
	
	beforeAll(async () => {
		// you can use `sinon.stub` instead
		adminStub = jest.spyOn(admin, "initializeApp");
	});

	afterAll(async () => {
		// clean things up
		adminStub.mockRestore();
		testEnv.cleanup();
	});

	beforeEach(async () => {
		fakeUserId = `fakeUser${Date.now()}`;
		fakePlantationID = `fakePlantation${Date.now()}`
		plantationPath = `plantations/${fakePlantationID}`
		editedPlantationRef = admin.firestore().doc(plantationPath)
		userPath = `users/${fakeUserId}`
		userRef = admin.firestore().doc(userPath)
	});

	afterEach(async () => {
		// clean things up
		await userRef.delete()
		await editedPlantationRef.delete()

	});


	it("should update Users/plantation when Plantation is updated", async () => {

		await userRef.set({})
		await editedPlantationRef.set({})

		const plantationsBefore = {
			userId: fakeUserId,
			name: "fakePlantionName",
			owner: "fakeOwner",
			management : "fakeManagement",
			isAudited: false,
			isActive: false,
		}
		const beforeSnap = testEnv.firestore
		.makeDocumentSnapshot(plantationsBefore, plantationPath);

		const plantationsAfter = {
			userId: fakeUserId,
			name: "fakePlantionNameChanged",
			owner: "fakeOwner",
			management : "fakeManagement",
			isAudited: false,
			isActive: false,
		}
		const afterSnap = testEnv.firestore
			.makeDocumentSnapshot(plantationsAfter, plantationPath);

			const change = testEnv.makeChange(beforeSnap, afterSnap);
			const wrapped = testEnv.wrap(api.plantationOnUpdate);
			wrapped(change,{
				params :{
					plantationId: fakePlantationID
				}
			});

			setTimeout(async () => {
				editedPlantation = await editedPlantationRef.get()
				editedUser = await userRef.get()
			}, 500);

			await waitForExpect(() => {
				expect(editedPlantation.data()).toHaveProperty("updatedAt")
				expect(editedUser.data()).toHaveProperty(`plantations.${fakePlantationID}.name`, "fakePlantionNameChanged")
			})

	});
});