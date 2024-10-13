import { createCookieSessionStorage, redirect } from "@remix-run/node";
import appConfig from "../app.config";
import jwt from "~/utils/jwt";
import User from "~/models/user.model";
import { cookieDefaultOptions } from "~/cookies.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";
import { UserType } from "~/types";
import { ROUTES } from "~/routes";

type SessionData = {
  token: string;
};

const session = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    maxAge: Number(appConfig.sessionExpires),
    ...cookieDefaultOptions,
  },
});

export const { getSession, commitSession, destroySession } = session;

export async function createUserSession({
  user,
  redirectTo,
  message,
  headers,
}: {
  user: Pick<UserType, "_id">;
  redirectTo: string;
  message: string;
  headers?: ResponseInit["headers"];
}) {
  const session = await getSession();
  session.set("token", await jwt.sign({ _id: user._id }));

  const newHeader = new Headers(headers);
  newHeader.append("Set-Cookie", await commitSession(session));

  return await redirectWithToast(
    redirectTo,
    { text: message, type: "success" },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function getTokenFromSession(request: Request) {
  const session = await getTokenSession(request);
  return session.get("token");
}

export async function getTokenSession(request: Request) {
  return await getSession(request.headers.get("Cookie"));
}

export async function redirectIfHaveSession(request: Request) {
  const token = await getTokenFromSession(request);
  const session = await getTokenSession(request);
  let decoded;

  try {
    decoded = await jwt.verify(String(token));
  } catch (error) {
    return;
  }

  const user = await User.findById(decoded._id).select("role").lean().exec();

  if (session.has("token") && user) {
    const url = ROUTES.DASHBOARD;

    throw redirect(url);
  }
}
