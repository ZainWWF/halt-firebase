import * as admin from "firebase-admin"
import authOnCreate from "./auth/onCreate";
import usersOnUpdate from "./users/onUpdate";
<<<<<<< HEAD
import vehicleOnCreate from './vehicles/onCreate'
import vehicleOnUpdate from './vehicles/onUpdate'
import profileOnCreate from  "./profile/onCreate"
=======
import vehicleOnCreate from "./vehicles/onCreate"
import vehicleOnUpdate from "./vehicles/onUpdate"
>>>>>>> bugfixes/general

admin.initializeApp();

export {
	authOnCreate,
	usersOnUpdate,
	vehicleOnCreate,
	vehicleOnUpdate,
	profileOnCreate
}

