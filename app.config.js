import * as process from "node:process";
import "dotenv/config.js";

const appConfig = {
  corsOrigin: JSON.parse(process.env.CORS_ORIGIN || []),
  databaseName: process.env.DATABASE_NAME | "",
  databaseUrl: process.env.DATABASE_URL | "",
  jwtExpires: process.env.JWT_EXPIRES | "1d",
  jwtSecret: process.env.JWT_SECRET | "",
  localDatabaseUrl: process.env.LOCAL_DATABASE_URL | "",
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  sessionExpires: JSON.parse(process.env.SESSION_EXPIRES || {}),
};

export default appConfig;
