import * as functions from 'firebase-functions';
import { millContactCreate } from './millContactCreate';

/** new mill rep user*/
export default functions.region("asia-east2").firestore
	.document('mills/{millId}/millAdmins/{millAdminId}').onCreate(async (snap, context) => {

		return await millContactCreate(snap)

	})


