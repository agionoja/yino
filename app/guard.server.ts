import { redirect } from "@remix-run/node";
import { getTokenSession } from "~/session.server";
import jwt from "~/utils/jwt";
import User, { Role } from "~/models/user.model";

export async function requireUser(request: Request) {
  const session = await getTokenSession(request);
  const token = session.get("token");
  let decoded;

  if (!token) {
    throw redirect("/auth/login");
  }

  // Gracefully decode the jwt token
  try {
    decoded = await jwt.verify(token);
  } catch (err) {
    throw redirect("/auth/login");
  }

  // check if the user still exits
  const user = await User.findById(decoded.id)
    .select("+passwordChangedAt")
    .exec();

  if (!user) throw redirect("/auth/login");

  // check if user recently changed password
  const passwordChanged = user.passwordChangedAfterJwt(
    decoded.iat || 0,
    user?.passwordChangedAt,
  );

  if (passwordChanged) {
    throw redirect("/auth/login");
  }

  console.log({ token });
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
