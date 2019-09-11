import * as admin from "firebase-admin"
import authOnCreate from "./auth/onCreate";
import userOnUpdate from "./users/onUpdate";
import vehicleOnCreate from "./vehicles/onCreate"
import vehicleOnUpdate from "./vehicles/onUpdate"
import profileOnCreate from  "./profile/onCreate"
import profileOnUpdate from  "./profile/onUpdate"
import plantationOnCreate from "./plantations/onCreate";
import plantationOnUpdate from "./plantations/onUpdate";


admin.initializeApp();

export {
	authOnCreate,
	userOnUpdate,
	vehicleOnCreate,
	vehicleOnUpdate,
	profileOnCreate,
	profileOnUpdate,
	plantationOnCreate,
	plantationOnUpdate
}

