import { createCookie } from "@remix-run/node";
import appConfig from "../app.config";

export const cookieDefaultOptions = {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: appConfig.nodeEnv === "production",
  secrets: appConfig.sessionSecret,
  domain:
    appConfig.nodeEnv === "production" ? "yino.onrender.com" : "localhost",
} as const;

export const otp = createCookie("_otp", {
  ...cookieDefaultOptions,
  maxAge: 60 * 5,
});
