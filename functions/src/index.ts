import * as admin from "firebase-admin"
import authOnCreate from "./auth/onCreate";
import usersOnUpdate from "./users/onUpdate";
import vehicleOnCreate from './vehicles/onCreate'

admin.initializeApp();


export { authOnCreate, usersOnUpdate, vehicleOnCreate }

