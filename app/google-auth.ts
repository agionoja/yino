import appConfig from "../app.config";
import asyncOperationHandler from "~/utils/async.operation";
import { redirect } from "@remix-run/node";
import { AppError } from "~/utils/app.error";
import { ROUTES } from "~/routes";

interface GoogleAuthParams {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  responseType: string;
  scope: string;
  grantType: string;
  accessType: "offline" | "online";
}

export default class GoogleAuth {
  readonly clientId: string;
  readonly redirectUrl: string;
  readonly responseType: string;
  readonly scope: string;
  readonly accessType: string;
  readonly grantType: string;
  readonly clientSecret: string;

  constructor({
    clientId,
    redirectUrl,
    responseType,
    scope,
    accessType,
    grantType,
    clientSecret,
  }: GoogleAuthParams) {
    this.clientId = clientId;
    this.redirectUrl = redirectUrl;
    this.responseType = responseType;
    this.scope = scope;
    this.accessType = accessType;
    this.grantType = grantType;
    this.clientSecret = clientSecret;
  }

  redirectToGoogleAuth() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: this.responseType,
      access_type: this.accessType,
      scope: this.scope.replace(",", " "), // Ensure the scope is space-separated
    });

    return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  }

  async getUserInfo(code: string) {
    return asyncOperationHandler(async () => {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          redirect_uri: this.redirectUrl,
          grant_type: this.grantType,
          code: code,
          client_secret: this.clientSecret,
        }),
      });

      if (!tokenRes.ok) {
        throw new AppError("Failed to fetch Google token", 500);
      }

      const token = await tokenRes.json();

      if (!token.access_token) {
        throw new AppError("No access token in Google token response", 500);
      }

      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      if (!userInfoRes.ok) {
        throw new AppError("Failed to fetch Google user info", 500);
      }

      const userInfo = await userInfoRes.json();

      const {
        id = undefined,
        email = undefined,
        verified_email = undefined,
        name = undefined,
      } = userInfo;

      return { id, email, isVerified: verified_email, name };
    });
  }
}

const onlineUrl = `https://${appConfig.onlineHost}${ROUTES.GOOGLE_AUTH_CB}`;
const localUrl = `http://${appConfig.localHost}:${appConfig.port}${ROUTES.GOOGLE_AUTH_CB}`;

export const googleAuth = new GoogleAuth({
  clientId: `${appConfig.googleClientId}`,
  redirectUrl: appConfig.nodeEnv === "production" ? onlineUrl : localUrl,
  responseType: "code",
  scope: "email profile",
  accessType: "offline",
  grantType: "authorization_code",
  clientSecret: `${appConfig.googleClientSecret}`,
});
