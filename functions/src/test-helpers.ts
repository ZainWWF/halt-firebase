// tslint:disable-next-line: no-implicit-dependencies
import functions from "firebase-functions-test";
import * as path from "path";
// tslint:disable-next-line: no-implicit-dependencies
require("dotenv").config()


// you can check all these information in firebase console/settings
const projectConfig = {
  projectId: process.env.projectId,
  databaseURL: process.env.databaseURL
};

// you should pass projectConfig and path to serviceAccountKey like this
// path.resolve defaults to directory where you're executing test command
// for my case, it's functions directory
export const testEnv = functions(projectConfig, path.resolve("service-key.json"));