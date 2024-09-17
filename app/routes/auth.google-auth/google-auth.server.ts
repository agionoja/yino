import { GoogleStrategy } from "remix-auth-google";
import appConfig from "../../../app.config";

const googleStrategy = new GoogleStrategy(
  {
    clientID: `${appConfig.googleClientSecret}`,
    clientSecret: `${appConfig.googleClientSecret}`,
    callbackURL: `${appConfig.nodeEnv === "production" ? appConfig.onlineHost : `http://localhost:3000`}/auth/google-auth`,
  },
  async ({ request, refreshToken, extraParams, profile }) => {
    console.log(request, request, extraParams, refreshToken, profile);
  },
);
