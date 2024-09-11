import * as process from "node:process";

const appConfig = {
  corsOrigin: JSON.parse(process.env.CORS_ORIGIN || []),
  databaseUrl: process.env.DATABASE_URL || "empty",
  jwtExpires: process.env.JWT_EXPIRES || "1d",
  jwtSecret: process.env.JWT_SECRET || "",
  localDatabaseUrl: process.env.LOCAL_DATABASE_URL || "",
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  sessionExpires: process.env.SESSION_EXPIRES,
  sessionSecret: JSON.parse(`${process.env.SESSION_SECRET}` || []),
};

export default appConfig;
