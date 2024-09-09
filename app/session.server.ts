import { createCookieSessionStorage } from "@remix-run/node";
import appConfig from "../app.config";
import createTimeStamp from "~/utils/timestamp";
import jwt from "~/utils/jwt";
import { IUser } from "~/models/user.model";

type SessionData = {
  token: string;
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
      maxAge: createTimeStamp(appConfig.sessionExpires),
      path: "/",
      sameSite: "lax",
      secure: appConfig.nodeEnv === "production",
      secrets: appConfig.sessionSecret,
    },
  });

export async function storeTokenInSession(user: Pick<IUser, "_id" | "role">) {
  const session = await getSession();
  session.set("token", await jwt.sign({ id: user._id, role: user.role }));
  return await commitSession(session);
}

export async function getTokenFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("token");
}
