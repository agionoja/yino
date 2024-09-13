import { getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User, { IUser, Role } from "~/models/user.model";
import globalErrorHandler from "~/utils/global.error";
import { redirectWithErrorToast } from "~/utils/toast/flash.session.server";

async function redirectToLogin(message: string) {
  return redirectWithErrorToast("/auth/login", message);
}

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = session.get("token");
  let decoded;

  if (!token) {
    throw await redirectToLogin("Login to gain access.");
  }

  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    const error = globalErrorHandler(err as Error);
    throw await redirectToLogin(error[0].message);
  }

  const user = await User.findById(decoded.id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) {
    throw await redirectToLogin("User no longer exists");
  }

  const passwordChanged = user.passwordChangedAfterJwt(
    decoded.iat || 0,
    user?.passwordChangedAt,
  );

  if (passwordChanged) {
    throw await redirectToLogin("You recently changed password. Login again");
  }

  return user;
}

export async function restrictTo(
  user: Pick<IUser, "role" | "_id">,
  request: Request,
  ...roles: Role[]
) {
  if (!roles.includes(user.role))
    throw await redirectWithErrorToast(
      request.headers.get("referer") || "/",
      "You are not authorized",
    );
}
