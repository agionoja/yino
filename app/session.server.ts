import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import appConfig from "../app.config";
import jwt from "~/utils/jwt";
import { IUser } from "~/models/user.model";
import { cookieDefaultOptions } from "~/cookies";
import { createToastUtilsWithCustomSession } from "remix-toast";

type SessionData = {
  token: string;
};

type SessionFlashData = {
  error: string;
};

const session = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "__session",
    maxAge: Number(appConfig.sessionExpires),
    ...cookieDefaultOptions,
  },
});

export const { getSession, commitSession, destroySession } = session;

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

export async function redirectIfHasToken(request: Request, url: string = "/") {
  const session = await getTokenSession(request);

  if (session.has("token")) throw redirect(url);

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const {
  getToast,
  redirectWithToast,
  redirectWithSuccess,
  redirectWithError,
  redirectWithInfo,
  redirectWithWarning,
  jsonWithSuccess,
  jsonWithError,
  jsonWithInfo,
  jsonWithWarning,
} = createToastUtilsWithCustomSession(session);
