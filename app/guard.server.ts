import { getTokenFromSession, getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User from "~/models/user.model";
import globalErrorHandler from "~/utils/global.error";
import {
  redirectWithErrorToast,
  redirectWithToastErrorEncodeUrlAndDestroySession,
} from "~/utils/toast/flash.session.server";
import appConfig from "../app.config";
import { getRefererUrl } from "~/utils/url";
import { Role, UserType } from "~/types";
import { ROUTES } from "~/routes";

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = await getTokenFromSession(request);
  let decoded;

  if (!token) {
    throw await redirectWithToastErrorEncodeUrlAndDestroySession(
      "Login to gain access.",
      session,
      request,
      ROUTES.LOGIN,
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
      ROUTES.LOGIN,
    );
  }
  const user = await User.findById(decoded._id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) {
    throw await redirectWithToastErrorEncodeUrlAndDestroySession(
      "User no longer exists",
      session,
      request,
      ROUTES.REGISTER,
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
      ROUTES.LOGIN,
    );
  }

  return user as UserType | null;
}

export async function restrictTo(
  user: Pick<UserType, "role">,
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
