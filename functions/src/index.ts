import * as admin from "firebase-admin"
import authOnCreate from "./auth/onCreate";
import usersOnUpdate from "./users/onUpdate";
import vehicleOnCreate from './vehicles/onCreate'
import vehicleOnUpdate from './vehicles/onUpdate'

admin.initializeApp();

export {
	authOnCreate,
	usersOnUpdate,
	vehicleOnCreate,
	vehicleOnUpdate
}

