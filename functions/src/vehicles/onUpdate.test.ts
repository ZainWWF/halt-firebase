import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"
// tslint:disable-next-line: no-implicit-dependencies
import waitForExpect from "wait-for-expect";

describe.only("Vehicle onUpdate trigger", () => {
	// jest.setTimeout(12000);
	let adminStub,
		fakeUserId,
		fakeVehicleID,
		vehiclePath,
		editedVehicleRef,
		editedVehicle,
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
		fakeVehicleID = `fakeVehicle${Date.now()}`
		vehiclePath = `vehicles/${fakeVehicleID}`
		editedVehicleRef = admin.firestore().doc(vehiclePath)
		userPath = `users/${fakeUserId}`
		userRef = admin.firestore().doc(userPath)
	});

	afterEach(async () => {
		// clean things up
		await userRef.delete()
		await editedVehicleRef.delete()

	});


	it("should update Users/vehicle when Vehicle is updated", async () => {

		await userRef.set({})
		await editedVehicleRef.set({})

		const vehiclesBefore = {
			make: "Honda",
			userId: fakeUserId,
			license: "fakeLicence",
			url: "fakeUrl"
		}
		const beforeSnap = testEnv.firestore
		.makeDocumentSnapshot(vehiclesBefore, vehiclePath);

		const vehiclesAfter = {
			make: "Toyota",
			userId: fakeUserId,
			license: "fakeLicence",
			url: "fakeUrl"
		}
		const afterSnap = testEnv.firestore
			.makeDocumentSnapshot(vehiclesAfter, vehiclePath);

			const change = testEnv.makeChange(beforeSnap, afterSnap);
			const wrapped = testEnv.wrap(api.vehicleOnUpdate);
			wrapped(change,{
				params :{
					vehicleId: fakeVehicleID
				}
			});

			setTimeout(async () => {
				editedVehicle = await editedVehicleRef.get()
				editedUser = await userRef.get()
			}, 500);

			await waitForExpect(() => {
				expect(editedVehicle.data()).toHaveProperty("updatedAt")
				expect(editedUser.data()).toHaveProperty(`vehicles.${fakeVehicleID}.make`, "Toyota")
			})

	});
});