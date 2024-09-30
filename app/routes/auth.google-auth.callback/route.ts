import { LoaderFunctionArgs } from "@remix-run/node";
import {
  commitSession,
  redirectIfHaveSession,
  storeTokenInSession,
} from "~/session.server";
import {
  getDashboardUrl,
  getUrlFromSearchParams,
  queryStringBuilder,
} from "~/utils/url";
import {
  parseAuthCbCookie,
  parseOtpCookie,
  serializeOtpCookie,
} from "~/cookies.server";
import { googleAuth } from "~/google-auth";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";
import { findOrCreateUser } from "~/routes/auth.google-auth.callback/queries";
import asyncOperationHandler from "~/utils/async.operation";
import Email from "~/utils/email";
import { logDevInfo } from "~/utils/dev.console";

export async function loader({ request }: LoaderFunctionArgs) {
  const { authCallbackAction, redirectUrl } = await parseAuthCbCookie(request);
  const state = authCallbackAction;

  await redirectIfHaveSession(
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
    return redirectWithErrorToast(
      state === "login" ? "/auth/login" : "/auth/register",
      errMsg(state === "login"),
    );
  }

  const { error: userError, data: user } = await findOrCreateUser({
    id: data?.id,
    name: data?.name,
    email: data?.email,
    verified: data?.isVerified,
  });

  if (userError) {
    // console.log({ userError });
    return redirectWithErrorToast(
      state === "login" ? "/auth/login" : "/auth/register",
      errMsg(state === "login"),
    );
  }

  const dashboardUrl = getDashboardUrl(user);

  const userRedirectUrl = redirectUrl
    ? redirectUrl !== "/"
      ? redirectUrl
      : dashboardUrl
    : dashboardUrl;

  if (user?.is2fa) {
    const otpCookie = await parseOtpCookie(request);
    otpCookie["_id"] = user.id;
    const otp = await user.generateAndSaveOtp();

    await asyncOperationHandler(async () => {
      try {
        await new Email(user).sendOtp(otp);
      } catch (e) {
        await user.destroyOtpAndSAve();
        throw e;
      }
    });

    const _2faRedirectUrl = queryStringBuilder("/auth/2fa", {
      key: "redirect",
      value: redirectUrl,
    });

    logDevInfo({ otp });

    return redirectWithToast(
      _2faRedirectUrl,
      {
        text: "OTP is valid for only 2 min!",
        type: "info",
      },
      {
        headers: {
          "Set-Cookie": await serializeOtpCookie(otpCookie),
        },
      },
    );
  }

  const session = await storeTokenInSession(user);
  const successMessage = user?.isNew ? "Welcome to Yino!" : "Welcome back!";

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
