import * as process from "node:process";

const env = process.env;

const appConfig = {
  emailPassword: String(env.EMAIL_PASSWORD),
  emailUsername: String(env.EMAIL_USERNAME),
  localHost: String(env.LOCAL_HOST),
  onlineHost: String(env.ONLINE_HOST),
  corsOrigin: JSON.parse(env.CORS_ORIGIN || []),
  databaseUrl: env.DATABASE_URL || "empty",
  jwtExpires: String(env.JWT_EXPIRES),
  jwtSecret: String(env.JWT_SECRET),
  localDatabaseUrl: String(env.LOCAL_DATABASE_URL),
  nodeEnv: env.NODE_ENV || "development",
  port: Number(env.PORT),
  sessionExpires: env.SESSION_EXPIRES,
  sessionSecret: JSON.parse(`${env.SESSION_SECRET}` || []),
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
};

export default appConfig;
