import { LoaderFunctionArgs } from "@remix-run/node";
import { verify } from "~/routes/auth.verify.$token/queries";
import { getDashboardUrl } from "~/utils/url";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { error, data: user } = await verify(params.token);

  if (error) {
    return await redirectWithErrorToast("/", error[0].message);
  }

  const redirectUrl = getDashboardUrl(user);
  return await redirectWithToast(redirectUrl, {
    type: "success",
    text: "Your account has been successfully verified!",
  });
}
