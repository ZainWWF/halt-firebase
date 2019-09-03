import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"

describe("vehicle functions", () => {
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

	it("should update Users/vehicle when new Vehicle is created", async () => {
		const fakeUserId = 	 `fakeUser${Date.now()}`;
		const fakeVehicleID = `fakeVehicle${Date.now()}`
		const fakeUserDocRef = admin
			.firestore()
			.doc(`/users/${fakeUserId}`)

		const wrapped = testEnv.wrap(api.vehicleOnCreate);
		const vehiclePath = `vehicles/${fakeVehicleID}`
		const fakeVehicle = {
			license: "fakeLicense123",
			chassis: "fakeChassis123",
			make: "Toyota",
			url: "fakeUrl",
			userId: fakeUserId
		}

		//create document to ref
		const vehicleDocRef = admin
			.firestore()
			.doc(vehiclePath)

		// document snaphshot of new vehicle
		const snap = testEnv.firestore
			.makeDocumentSnapshot(fakeVehicle, vehiclePath);

		await vehicleDocRef.set(fakeVehicle)

		await wrapped(snap, {
			params: {
				vehicleId: fakeVehicleID
			}
		});

		const createdVehicle = await vehicleDocRef.get();
		const updatedUserVehicle = await fakeUserDocRef.get()
		
		expect(createdVehicle.data()).toHaveProperty("createdAt")
		expect(updatedUserVehicle.data()).toHaveProperty(`vehicles.${fakeVehicleID}`)

		// clean up
		await vehicleDocRef.delete()
		await fakeUserDocRef.delete();

	});
});