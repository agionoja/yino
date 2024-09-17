import { createCookie } from "@remix-run/node";
import appConfig from "../app.config";

type HasOtp = {
  hasOtp: boolean;
};

export type GoogleAuthCallbackAction = {
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
      ? appConfig.onlineHost
      : appConfig.localHost,
} as const;

export const hasOtp = createCookie("__hasOtp", {
  ...cookieDefaultOptions,
  maxAge: 60,
});

export const googleAuthCallbackAction = createCookie(
  "__googleAuthCallbackAction",
  {
    ...cookieDefaultOptions,
  },
);

export async function parseHasOtpCookie(request: Request) {
  const cookie = request.headers.get("Cookie");
  const parsedCookie = (await hasOtp.parse(cookie)) || { hasOtp: false };

  return parsedCookie as HasOtp;
}

export async function serializeHasOtpCookie(cookie: HasOtp) {
  return hasOtp.serialize(cookie);
}

export async function parseAuthCbCookie(request: Request) {
  const cookie = request.headers.get("Cookie");
  const parsedCookie = (await googleAuthCallbackAction.parse(cookie)) || {};

  return parsedCookie as GoogleAuthCallbackAction;
}

export async function serializeAuthCbCookie(cookie: GoogleAuthCallbackAction) {
  return googleAuthCallbackAction.serialize(cookie);
}
