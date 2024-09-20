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

  await redirectIfHaveValidSessionToken(
    request,
    state === "login"
      ? "You are already logged in!"
      : "You already have an account!",
  );

  const googleAuthCode = getUrlFromSearchParams(request.url, "code");

  const { data, error } = await googleAuth.getUserInfo(String(googleAuthCode));
  const errMsg = (isLogin: boolean) =>
    isLogin
      ? "Unable to log you in. Please try again."
      : "There was an error creating your account. Please try again.";

  if (error) {
    console.log(error);
    return redirectWithErrorToast(
      state === "login" ? "/auth/login" : "/auth/register",
      errMsg(state === "login"),
    );
  }

  const { error: userError, data: userData } = await findOrCreateUser({
    id: data?.id,
    name: data?.name,
    email: data?.email,
    verified: data?.isVerified,
  });

  if (userError) {
    return redirectWithErrorToast(
      state === "login" ? "/auth/login" : "/auth/register",
      errMsg(state === "login"),
    );
  }

  const dashboardUrl = getDashboardUrl(userData?.user);

  const userRedirectUrl = redirectUrl
    ? redirectUrl !== "/"
      ? redirectUrl
      : dashboardUrl
    : dashboardUrl;

  const session = await storeTokenInSession(userData?.user);
  const successMessage = userData?.isNew ? "Welcome to Yino!" : "Welcome back!";

  return await redirectWithToast(
    userRedirectUrl,
    {
      text: successMessage,
      type: "success",
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}
