import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"

describe.only("Profile onCreate trigger", () => {
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

	it("should update Users/profile when new Profile is created", async () => {
		const userId = `fakeUser${Date.now()}`;
		const userDocRef = admin
			.firestore()
			.doc(`/users/${userId}`)
		await userDocRef.set({ profile: {} })

		const wrapped = testEnv.wrap(api.profileOnCreate);
		const profilePath = `profiles/${userId}`
		const profile = {
			name: "fakeUser",
			photoUrl: "fakeUrl",
		}

		const profileDocRef = admin
			.firestore()
			.doc(profilePath)
		await profileDocRef.set(profile)

		// document snaphshot of new vehicle
		const snap = testEnv.firestore
			.makeDocumentSnapshot(profile, profilePath);
		await wrapped(snap, {
			params: {
				userId: userId
			}
		});

		// const createdVehicle = await vehicleDocRef.get();
		const updatedProfile = await profileDocRef.get()
		const updatedUser = await userDocRef.get()

		expect(updatedProfile.data()).toHaveProperty("createdAt")
		expect(updatedUser.data()).toHaveProperty("profile.name", "fakeUser" )

		// clean up
		await profileDocRef.delete()
		await userDocRef.delete();

	});
});