import { createCookie } from "@remix-run/node";
import appConfig from "../app.config";

type HasOtp = {
  hasOtp: boolean;
};

export type AuthCbAction = {
  auth_callback_action: "register" | "login";
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

export const authCbAction = createCookie("__auth_callback_action", {
  ...cookieDefaultOptions,
});

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
  const parsedCookie = (await authCbAction.parse(cookie)) || {
    auth_callback_action: false,
  };

  return parsedCookie as AuthCbAction;
}

export async function serializeAuthCbCookie(cookie: AuthCbAction) {
  return authCbAction.serialize(cookie);
}
