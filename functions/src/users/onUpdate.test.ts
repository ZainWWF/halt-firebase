import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"
// tslint:disable-next-line: no-implicit-dependencies
import waitForExpect from "wait-for-expect";

describe("User onUpdate trigger", () => {
	let adminStub,
		fakeUserId,
		fakeVehicleID,
		vehiclePath,
		removedVehicle,
		removedVehicleRef,
		editedVehicleRef,
		userPath,
		editedUser,
		userRef: FirebaseFirestore.DocumentReference;

	beforeAll(async () => {
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
		removedVehicleRef = admin.firestore().doc(vehiclePath)
		editedVehicleRef = admin.firestore().doc(vehiclePath)
		userPath = `users/${fakeUserId}`
		userRef = admin.firestore().doc(userPath)
	});

	afterEach(async () => {
		// clean things up
		await removedVehicleRef.delete()

		
	});


	it("should update Vehicle when new User.vehicle entry is removed", async () => {

		await removedVehicleRef.set({})

		const userVehiclesBefore = {
			vehicles: {
				id1: { dummy: null },
				id2: { ref: removedVehicleRef }
			}
		}
		const beforeSnap = testEnv.firestore
			.makeDocumentSnapshot(userVehiclesBefore, userPath);

		const userVehiclesAfter = {
			vehicles: {
				id1: { dummy: null }
			}
		}
		const afterSnap = testEnv.firestore
			.makeDocumentSnapshot(userVehiclesAfter, userPath);

		const change = testEnv.makeChange(beforeSnap, afterSnap);
		const wrapped = testEnv.wrap(api.usersOnUpdate);
		wrapped(change);

		setTimeout(async () => {
			removedVehicle = await removedVehicleRef.get()
		}, 500);

		await waitForExpect(() => {
			expect(removedVehicle.data()).toHaveProperty("removedAt")
		})

	});


	it("should update Vehicle when new User.vehicle entry ALL is removed", async () => {

		await removedVehicleRef.set({})

		const userVehiclesBefore = {
			vehicles: {
				id2: { ref: removedVehicleRef }
			}
		}
		const beforeSnap = testEnv.firestore
			.makeDocumentSnapshot(userVehiclesBefore, userPath);

		const userVehiclesAfter = {
			vehicles: {
			}
		}
		const afterSnap = testEnv.firestore
			.makeDocumentSnapshot(userVehiclesAfter, userPath);

		const change = testEnv.makeChange(beforeSnap, afterSnap);
		const wrapped = testEnv.wrap(api.usersOnUpdate);
		wrapped(change);

		setTimeout(async () => {
			removedVehicle = await removedVehicleRef.get()
		}, 500);

		await waitForExpect(() => {
			expect(removedVehicle.data()).toHaveProperty("removedAt")
		})

	});

	it("should restore Vehicle when new User.vehicle field values are changed", async () => {

		await userRef.set({})

		const userVehiclesBefore = {
			vehicles: {
				id2: {
					ref: editedVehicleRef,
					make: "Honda"
				}
			}
		}
		const beforeSnap = testEnv.firestore
			.makeDocumentSnapshot(userVehiclesBefore, userPath);

		const userVehiclesAfter = {
			vehicles: {
				id2: {
					ref: editedVehicleRef,
					make: "Toyota"
				}
			}
		}
		const afterSnap = testEnv.firestore
			.makeDocumentSnapshot(userVehiclesAfter, userPath);

		const change = testEnv.makeChange(beforeSnap, afterSnap);
		const wrapped = testEnv.wrap(api.usersOnUpdate);
		wrapped(change, {
			params : {
				userId : fakeUserId
			} 
		});

		setTimeout(async () => {
			editedUser = await userRef.get()
			await userRef.delete()
		}, 500);

		await waitForExpect(() => {
			expect(editedUser.data()).toHaveProperty("id2.make", "Honda")
		})


	});

});