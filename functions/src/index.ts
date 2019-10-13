import * as admin from "firebase-admin"
import authOnCreate from "./auth/onCreate";
import userOnUpdate from "./users/onUpdate";
import vehicleOnCreate from "./vehicles/onCreate"
import vehicleOnUpdate from "./vehicles/onUpdate"
import profileOnCreate from "./profile/onCreate"
import profileOnUpdate from "./profile/onUpdate"
import plantationOnCreate from "./plantations/onCreate";
import plantationOnUpdate from "./plantations/onUpdate";
import assistanceOnCreate from "./assistance/onCreate"
import assistanceOnUpdate from "./assistance/onUpdate"
import superUserOnCreate from "./superUser/onCreate"
import superUserOnDelete from "./superUser/onDelete"
import superUserOnUpdate from "./superUser/onUpdate"
import millRepOnCreate from "./millReps/onCreate"
import millRepOnDelete from "./millReps/onDelete"
import transactionOnCreate from "./transactions/onCreate"
// import millOnCreate from "./mills/onCreate"


admin.initializeApp();

export {
	authOnCreate,
	userOnUpdate,
	vehicleOnCreate,
	vehicleOnUpdate,
	profileOnCreate,
	profileOnUpdate,
	plantationOnCreate,
	plantationOnUpdate,
	assistanceOnCreate,
	assistanceOnUpdate,
	superUserOnCreate,
	superUserOnUpdate,
	superUserOnDelete,
	millRepOnCreate,
	millRepOnDelete,
	transactionOnCreate,
	// millOnCreate
}

