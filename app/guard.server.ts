import { destroySession, getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User, { IUser, Role } from "~/models/user.model";
import globalErrorHandler from "~/utils/global.error";
import {
  redirectWithErrorToast,
  redirectWithToastAndDestroyExistingSession,
} from "~/utils/toast/flash.session.server";
import { Session } from "@remix-run/node";

async function redirectTo(
  message: string,
  session: Session,
  url = "/auth/login",
) {
  // return redirectWithErrorToast("/auth/login", message);
  return redirectWithToastAndDestroyExistingSession(
    url,
    { type: "error", text: message },
    session,
  );
}

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = session.get("token");
  let decoded;

  if (!token) {
    throw await redirectTo("Login to gain access.", session);
  }

  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    const error = globalErrorHandler(err as Error);
    throw await redirectTo(error[0].message, session);
  }

  const user = await User.findById(decoded.id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) {
    throw await redirectTo("User no longer exists", session, "/auth/register");
  }

  const passwordChanged = user.passwordChangedAfterJwt(
    decoded.iat || 0,
    user?.passwordChangedAt,
  );

  if (passwordChanged) {
    await destroySession(session);
    throw await redirectTo(
      "You recently changed password. Login again",
      session,
    );
  }

  return user;
}

export async function restrictTo(
  user: Pick<IUser, "role">,
  request: Request,
  ...roles: Role[]
) {
  if (!roles.includes(user.role))
    throw await redirectWithErrorToast(
      request.headers.get("referer") || "/",
      "You are not authorized",
    );
}
