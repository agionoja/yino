import { redirect, Session } from "@remix-run/node";
import { commitSession, getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User, { Role } from "~/models/user.model";
import globalErrorHandler from "~/utils/global.error";

async function redirectToLogin(request: Request, session: Session) {
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = session.get("token");
  let decoded;

  if (!token) {
    session.flash("error", "You are not logged in. Login to gain access");

    throw await redirectToLogin(request, session);
  }

  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    const error = globalErrorHandler(err as Error);
    session.flash("error", error.message);

    throw await redirectToLogin(request, session);
  }

  const user = await User.findById(decoded.id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) {
    session.flash("error", "User no longer exists");
    throw await redirectToLogin(request, session);
  }

  const passwordChanged = user.passwordChangedAfterJwt(
    decoded.iat || 0,
    user?.passwordChangedAt,
  );

  if (passwordChanged) {
    session.flash("error", "You recently changed password. Login again");
    throw await redirectToLogin(request, session);
  }

  return user;
}

// Define a type that ensures the string starts with "/"
type RestrictTo<Prefix extends string> = Prefix extends `/${string}`
  ? Prefix
  : never;

export async function restrictTo(
  request: Request,
  redirectTo: RestrictTo<string>, // Use the new type here to enforce "/"
  ...roles: Role[]
) {
  const session = await getTokenSession(request);
  const token = session.get("token");

  if (!token) throw redirect("/auth/login");

  let decoded;
  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    // Handle verification error by redirecting to login if the token is invalid
    throw redirect("/auth/login");
  }

  const role = decoded.role;

  if (!roles.includes(role)) {
    throw redirect(redirectTo);
  }
}
