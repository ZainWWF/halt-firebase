import * as admin from "firebase-admin"
import authOnCreate from "./auth/onCreate";
import usersOnUpdate from "./users/onUpdate";
<<<<<<< HEAD
<<<<<<< HEAD
import vehicleOnCreate from './vehicles/onCreate'
import vehicleOnUpdate from './vehicles/onUpdate'
import profileOnCreate from  "./profile/onCreate"
=======
import vehicleOnCreate from "./vehicles/onCreate"
import vehicleOnUpdate from "./vehicles/onUpdate"
>>>>>>> bugfixes/general
=======
import vehicleOnCreate from "./vehicles/onCreate"
import vehicleOnUpdate from "./vehicles/onUpdate"
import profileOnCreate from  "./profile/onCreate"
import profileOnUpdate from  "./profile/onUpdate"
>>>>>>> features/functions/profile

admin.initializeApp();

export {
	authOnCreate,
	usersOnUpdate,
	vehicleOnCreate,
	vehicleOnUpdate,
	profileOnCreate,
	profileOnUpdate
}

