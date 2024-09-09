import { createCookieSessionStorage } from "@remix-run/node";
import appConfig from "../app.config";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      domain: "yino.onrender.com",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: appConfig.nodeEnv === "production",
      secrets: appConfig.sessionSecret,
    },
  });
