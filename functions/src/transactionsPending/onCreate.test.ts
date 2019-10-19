import * as admin from "firebase-admin";
import { testEnv } from "../test-helpers"
import * as api from "../index"

describe("pendingTransaction onCreate trigger", () => {
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

	it("create a new pending entry in buyer and seller tradeboard", async () => {

		const sellerId = "EEItyiotOZRsC2BQ8GC746XqBeQ2"

		const agentToAgentBuyPayload = {
			amount: 2,
			buyerId: "TPTPZMVQ2GbJzZ3NU1wrhjaYeqj1",
			buyerName: "+6598897665",
			clientPhoneNumber: "+6598897664",
			clientType: "Agent",
			millId: null,
			millName: "",
			origins: {},
			transactionType: "Buy",
			transportationBy: "Seller",
			vehicle: "",
			vehicleId: null
		}


		const wrapped = testEnv.wrap(api.transactionPendingOnCreate);
		const refPath = "transactionsPending/transactionsPendingTest"

		// document snaphshot of new plantation
		const snap = testEnv.firestore
			.makeDocumentSnapshot(agentToAgentBuyPayload, refPath);


		// await wrapped(snap, {
		// 	params: {
		// 		transactionsId: "transactionsPendingTest"
		// 	}
		// });


		await wrapped(snap)

		//create document ref
		const buyerDocRef = admin
			.firestore()
			.doc(`tradeboard/${agentToAgentBuyPayload.buyerId}`)


		//create document ref
		const sellerDocRef = admin
		.firestore()
		.doc(`tradeboard/${sellerId}`)

		
		const buyerDocSnap = await buyerDocRef.get();
		const sellerDocSnap = await sellerDocRef.get()

		console.log("buyerDocData: ",buyerDocSnap.data())
		console.log("sellerDocData: ",sellerDocSnap.data())


		expect(true)

	});
});