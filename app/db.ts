import mongoose from "mongoose";
import appConfig from "../app.config";
import * as process from "node:process";

type DbOptions = {
  localDb?: boolean;
  delay?: number;
  maxRetries?: number;
};

export default {
  connectDb: async (options?: DbOptions) => {
    const env = appConfig.nodeEnv;
    const isOnline = env === "production" ? true : !options?.localDb;
    const dbUrl = isOnline ? appConfig.databaseUrl : appConfig.localDatabaseUrl;
    const maxRetries = options?.maxRetries || 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await mongoose.connect(dbUrl);
        console.log("Database connected successfully");
        return; // Exit the function once connected
      } catch (err) {
        retries++;
        console.error(`Database connection attempt ${retries} failed`);
        if (retries >= maxRetries) {
          console.error(
            "Max retries reached. Unable to connect to the database.",
            err,
          );
          process.exit(1); // Exit with a failure code
        }
        await new Promise((res) => setTimeout(res, options?.delay || 5000)); // Wait before retrying
      }
    }
  },
};
