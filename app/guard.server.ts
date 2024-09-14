import { getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User, { IUser, Role } from "~/models/user.model";
import globalErrorHandler from "~/utils/global.error";
import {
  redirectWithErrorAndEncodeUrl,
  redirectWithErrorToast,
} from "~/utils/toast/flash.session.server";
import appConfig from "../app.config";

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = session.get("token");
  let decoded;

  if (!token) {
    throw await redirectWithErrorAndEncodeUrl(
      "Login to gain access.",
      session,
      request,
    );
  }

  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    const error = globalErrorHandler(err as Error);
    throw await redirectWithErrorAndEncodeUrl(
      error[0].message,
      session,
      request,
    );
  }

  const user = await User.findById(decoded.id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) {
    throw await redirectWithErrorAndEncodeUrl(
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
    throw await redirectWithErrorAndEncodeUrl(
      "You recently changed password. Login again",
      session,
      request,
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
    const referer = request.headers.get("referer");
    const redirectLink =
      referer?.includes(appConfig.localHost) || // host eg localhost:3000
      referer?.includes(appConfig.onlineHost)
        ? referer
        : "/";

    // console.log({ redirectLink });
    throw await redirectWithErrorToast(redirectLink, "You are not authorized");
  }
}
