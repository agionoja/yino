import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import appConfig from "../app.config";
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
      domain:
        appConfig.nodeEnv === "production" ? "yino.onrender.com" : "localhost",
      httpOnly: true,
      maxAge: Number(appConfig.sessionExpires),
      path: "/",
      sameSite: "lax",
      secure: appConfig.nodeEnv === "production",
      secrets: appConfig.sessionSecret,
    },
  });

export async function storeTokenInSession(user: Pick<IUser, "_id" | "role">) {
  const session = await getSession();
  session.set("token", await jwt.sign({ id: user._id, role: user.role }));

  throw redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getTokenSession(request: Request) {
  return await getSession(request.headers.get("Cookie"));
}

export async function hasTokenSession(request: Request) {
  const session = await getTokenSession(request);

  if (session.has("token")) throw redirect("/");

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
