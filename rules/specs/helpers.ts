import * as firebase from '@firebase/testing';
import fs from "fs"

declare global {
  namespace jest {
    interface Matchers<R> {
			toAllow(): R;
			toDeny(): R;
			
    }
  }
}

export const setup = async (auth, data) => {
	const projectId: string = `rules-spec-${Date.now()}`
	const app = await firebase.initializeTestApp({
		projectId,
		auth
	})

	const db = app.firestore();

	// write mock documents before rules
	if (data) {
		for (const key in data) {
			const ref = db.doc(key);
			await ref.set(data[key])
		}
	}

	await firebase.loadFirestoreRules({
		projectId,
		rules: fs.readFileSync('firestore.rules', "utf8")
	})
	
	return db
}

export const teardown = async () => {
	Promise.all(firebase.apps().map(
		app => app.delete()
	))
}



expect.extend({
	async toAllow(x){
			let pass = false;
			try {
				 await firebase.assertSucceeds(x);
				 pass = true;

			}catch (err){}

			return {
				pass ,
				message : () => 'Expected Firebase operation to be allowed, but it failed'
			}
	}
})

expect.extend({
	async toDeny(x){
			let pass = false;
			try {
				 await firebase.assertFails(x);
				 pass = true;

			}catch (err){}

			return {
				pass ,
				message : () => 'Expected Firebase operation to be denied, but it was allowed'
			}
	}
})


export const expectExtend = Object.assign(expect);