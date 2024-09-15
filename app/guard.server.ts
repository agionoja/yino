import { getTokenFromSession, getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User, { IUser, Role } from "~/models/user.model";
import globalErrorHandler from "~/utils/global.error";
import {
  redirectWithToastErrorEncodeUrlAndDestroySession,
  redirectWithErrorToast,
} from "~/utils/toast/flash.session.server";
import appConfig from "../app.config";
import { getRefererUrl } from "~/utils/url";

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = await getTokenFromSession(session);
  let decoded;

  if (!token) {
    throw await redirectWithToastErrorEncodeUrlAndDestroySession(
      "Login to gain access.",
      session,
      request,
      "/auth/login",
    );
  }

  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    const error = globalErrorHandler(err as Error);
    throw await redirectWithToastErrorEncodeUrlAndDestroySession(
      error[0].message,
      session,
      request,
      "/auth/login",
    );
  }

  const user = await User.findById(decoded.id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) {
    throw await redirectWithToastErrorEncodeUrlAndDestroySession(
      "User no longer exists",
      session,
      request,
      "/auth/register",
    );
  }

  const passwordChanged = user.passwordChangedAfterJwt(
    decoded.iat || 0,
    user?.passwordChangedAt,
  );

  if (passwordChanged) {
    throw await redirectWithToastErrorEncodeUrlAndDestroySession(
      "You recently changed password. Login again",
      session,
      request,
      "/auth/login",
    );
  }

  return user;
}

export async function restrictTo(
  user: Pick<IUser, "role">,
  request: Request,
  ...roles: Role[]
) {
  if (!roles.includes(user.role)) {
    const referer = getRefererUrl(request);
    const redirectLink =
      referer?.includes(appConfig.localHost) ||
      referer?.includes(appConfig.onlineHost)
        ? referer
        : "/";
    throw await redirectWithErrorToast(redirectLink, "You are not authorized");
  }
}
