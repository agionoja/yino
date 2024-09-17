import { LoaderFunctionArgs } from "@remix-run/node";
import {
  commitSession,
  redirectIfHaveValidSessionToken,
  storeTokenInSession,
} from "~/session.server";
import { getDashboardUrl, getUrlFromSearchParams } from "~/utils/url";
import { parseAuthCbCookie } from "~/cookies.server";
import { googleAuth } from "~/google-auth";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";
import { findOrCreateUser } from "~/routes/auth.google-auth.callback/queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const { authCallbackAction, redirectUrl } = await parseAuthCbCookie(request);
  const state = authCallbackAction;

  // Check if user is already authenticated and redirect accordingly
  await redirectIfHaveValidSessionToken(
    request,
    state === "login"
      ? "You are already logged in!"
      : "You already have an account!",
  );

  const googleAuthCode = getUrlFromSearchParams(request.url, "code");

  // Fetch user info from Google using the authorization code
  const { data, error } = await googleAuth.getUserInfo(String(googleAuthCode));

  if (error) {
    console.log(error);
    return redirectWithErrorToast(
      state === "login" ? "/auth/login" : "/auth/register",
      state === "login"
        ? "Unable to log you in. Please try again."
        : "There was an error creating your account. Please try again.",
    );
  }

  // Try to find or create the user based on the Google info
  const { error: userError, data: user } = await findOrCreateUser({
    id: data?.id,
    name: data?.name,
    email: data?.email,
    verified: data?.isVerified,
  });

  if (userError) {
    return redirectWithErrorToast(
      state === "login" ? "/auth/login" : "/auth/register",
      state === "login"
        ? "We couldn't log you in at this time. Please try again later."
        : "We couldn't register your account. Please try again later.",
    );
  }

  const userRedirectUrl = redirectUrl ? redirectUrl : getDashboardUrl(user);
  const session = await storeTokenInSession(user);

  // Redirect with success message and store the session token
  return await redirectWithToast(
    userRedirectUrl,
    {
      text:
        state === "login"
          ? "Welcome back!"
          : "Your account has been successfully registered",
      type: "success",
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}
