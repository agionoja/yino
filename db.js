import mongoose from "mongoose";
import appConfig from "./app.config.js";
import * as process from "node:process";

export default {
  connect: async (options = {}) => {
    const env = appConfig.nodeEnv;
    const isOnline = env === "production" ? true : !options?.localDb;
    const dbUrl = isOnline ? appConfig.databaseUrl : appConfig.localDatabaseUrl;
    const maxRetries = options?.maxRetries || 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await mongoose.connect(dbUrl);
        console.log(
          `${isOnline ? "remote" : "local"} Database connected successfully`,
        );
        return; // Exit the function once connected
      } catch (err) {
        retries++;
        console.error(`Database connection attempt ${retries} failed`);
        if (retries >= maxRetries) {
          // Fallback to local db in dev.
          if ((isOnline && env === "development") || options?.forceLocal) {
            try {
              console.log(
                "Failed to connect to the online db. Switching to local db",
              );
              await mongoose.connect(appConfig.localDatabaseUrl);
              console.log("Local database connection successfully");
              return;
            } catch (err) {
              console.error(
                `Max retires reached and fallback to local db failed with: ${err}`,
              );

              process.exit(1);
            }
          }
          console.error(
            `Max retries reached. Unable to connect to the database with url: ${dbUrl}.`,
            err,
          );
          process.exit(1); // Exit with a failure code
        }
        await new Promise((res) => setTimeout(res, options?.delay || 5000)); // Wait before retrying
      }
    }
  },
};
