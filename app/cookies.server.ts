import { createCookie } from "@remix-run/node";
import appConfig from "../app.config";
import { Types } from "mongoose";

type OtpCookie = {
  _id?: Types.ObjectId;
};

export type GoogleAuthCallbackActionCookie = {
  authCallbackAction: "register" | "login";
  redirectUrl: string;
};

export const cookieDefaultOptions = {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: appConfig.nodeEnv === "production",
  secrets: appConfig.sessionSecret,
  domain:
    appConfig.nodeEnv === "production"
      ? appConfig.localHost
      : appConfig.localHost,
} as const;

export const hasOtp = createCookie("__otp", {
  ...cookieDefaultOptions,
  maxAge: 60 * 30,
});

export const googleAuthCallbackAction = createCookie(
  "__googleAuthCallbackAction",
  {
    ...cookieDefaultOptions,
  },
);

export async function parseOtpCookie(request: Request) {
  const cookie = request.headers.get("Cookie");
  const parsedCookie = (await hasOtp.parse(cookie)) || {};

  return parsedCookie as OtpCookie;
}

export async function serializeOtpCookie(cookie: OtpCookie) {
  return hasOtp.serialize(cookie);
}

export async function parseAuthCbCookie(request: Request) {
  const cookie = request.headers.get("Cookie");
  const parsedCookie = (await googleAuthCallbackAction.parse(cookie)) || {};

  return parsedCookie as GoogleAuthCallbackActionCookie;
}

export async function serializeAuthCbCookie(
  cookie: GoogleAuthCallbackActionCookie,
) {
  return googleAuthCallbackAction.serialize(cookie);
}
