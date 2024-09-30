import { ActionFunctionArgs } from "@remix-run/node";
import { getTokenFromSession } from "~/session.server";
import { getBaseUrl, getRefererUrl } from "~/utils/url";
import { sendVerification } from "~/routes/auth.send-verification/queries";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";
import { logDevInfo } from "~/utils/dev.console";

export async function action({ request }: ActionFunctionArgs) {
  const token = await getTokenFromSession(request);
  const baseUrl = getBaseUrl(request);
  const redirectUrl = getRefererUrl(request) || "/";
  const { error, data: user } = await sendVerification(token, baseUrl);

  if (error || !user) {
    logDevInfo({ referer: request.referrer, redirectUrl });

    if (error && error[0].path === "isVerified") {
      return await redirectWithToast(redirectUrl, {
        text: error[0].message,
        type: "warning",
      });
    }

    return redirectWithErrorToast(
      redirectUrl,
      "Failed to send verification email. Please try again.",
    );
  }

  return redirectWithToast(redirectUrl, {
    text: "Verification email sent! Please check your inbox.",
    type: "success",
  });
}
