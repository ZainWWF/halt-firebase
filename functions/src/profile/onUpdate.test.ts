import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"
// tslint:disable-next-line: no-implicit-dependencies
import waitForExpect from "wait-for-expect";

describe("Profiles onUpdate trigger", () => {
	// jest.setTimeout(12000);
	let adminStub,
		fakeUserId,
		profilePath,
		editedProfileRef,
		editedProfile,
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
		profilePath = `profiles/${fakeUserId}`
		editedProfileRef = admin.firestore().doc(profilePath)
		userPath = `users/${fakeUserId}`
		userRef = admin.firestore().doc(userPath)
	});

	afterEach(async () => {
		// clean things up
		await userRef.delete()
		await editedProfileRef.delete()

	});


	it("should update Users/profile when Profile is updated", async () => {

		await userRef.set({})
		await editedProfileRef.set({})

		const profileBefore = {
			name: "fakeUser",
			photoUrl: "no photo",
		}
		const beforeSnap = testEnv.firestore
		.makeDocumentSnapshot(profileBefore, profilePath);

		const profileAfter = {
			name: "fakeUser",
			photoUrl: "fakeUrl1",
		}
		const afterSnap = testEnv.firestore
			.makeDocumentSnapshot(profileAfter, profilePath);

			const change = testEnv.makeChange(beforeSnap, afterSnap);
			const wrapped = testEnv.wrap(api.profileOnUpdate);
			wrapped(change,{
				params :{
					userId: fakeUserId}
			});

			setTimeout(async () => {
				editedProfile = await editedProfileRef.get()
				editedUser = await userRef.get()
			}, 500);

			await waitForExpect(() => {
				expect(editedProfile.data()).toHaveProperty("updatedAt")
				expect(editedUser.data()).toHaveProperty("profile.photoUrl","fakeUrl1")
			})

	});
});