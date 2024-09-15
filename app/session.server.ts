import { createCookieSessionStorage, Session } from "@remix-run/node";
import appConfig from "../app.config";
import jwt from "~/utils/jwt";
import User, { IUser } from "~/models/user.model";
import { cookieDefaultOptions } from "~/cookies.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";

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

export async function storeTokenInSession(user: Pick<IUser, "_id">) {
  const session = await getSession();
  session.set("token", await jwt.sign({ id: user._id }));

  return session;
}

export async function getTokenFromSession(session: Session) {
  return String(session.get("token"));
}

export async function getTokenSession(request: Request) {
  return await getSession(request.headers.get("Cookie"));
}

export async function redirectIfHaveValidToken(
  request: Request,
  message = "You are already logged in!",
) {
  const session = await getTokenSession(request);
  const token = await getTokenFromSession(session);
  let decoded;

  try {
    decoded = await jwt.verify(token);
  } catch (error) {
    return;
  }

  const user = await User.findById(decoded?.id).select("_id").lean().exec();

  if (session.has("token") && user) {
    const url = request.headers.get("referer") || "/";
    throw await redirectWithToast(url, {
      text: message,
      type: "info",
    });
  }
}
