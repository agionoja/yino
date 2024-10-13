import { LoaderFunctionArgs } from "@remix-run/node";
import { createUserSession, redirectIfHaveSession } from "~/session.server";
import { getUrlFromSearchParams, queryStringBuilder } from "~/utils/url";
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
import { logDevError, logDevInfo } from "~/utils/dev.console";
import { ROUTES } from "~/routes";

export async function loader({ request }: LoaderFunctionArgs) {
  const { authCallbackAction, redirectUrl } = await parseAuthCbCookie(request);
  const state = authCallbackAction;

  await redirectIfHaveSession(request);

  const googleAuthCode = getUrlFromSearchParams(request.url, "code");

  const { data, error } = await googleAuth.getUserInfo(String(googleAuthCode));
  const errMsg = (isLogin: boolean) =>
    isLogin
      ? "Unable to log you in. Please try again."
      : "There was an error creating your account. Please try again.";

  if (error) {
    logDevError({ error });
    return redirectWithErrorToast(
      state === "login" ? ROUTES.LOGIN : ROUTES.REGISTER,
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
    logDevError(userError);
    return redirectWithErrorToast(
      state === "login" ? ROUTES.LOGIN : ROUTES.REGISTER,
      errMsg(state === "login"),
    );
  }

  const redirectTo = redirectUrl ? redirectUrl : ROUTES.DASHBOARD;

  if (user?.is2fa) {
    const otpCookie = await parseOtpCookie(request);
    otpCookie["_id"] = user.id;
    const otp = await user.generateAndSaveOtp();

    await asyncOperationHandler(async () => {
      try {
        await new Email(user).sendOtp(otp);
      } catch (e) {
        await user.destroyOtpAndSave();
        throw e;
      }
    });

    const _2faRedirectUrl = queryStringBuilder(ROUTES["2FA"], {
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
  const successMessage = user?.isNew ? "Welcome to Yino!" : "Welcome back!";

  return await createUserSession({
    user,
    redirectTo,
    message: successMessage,
  });
}
