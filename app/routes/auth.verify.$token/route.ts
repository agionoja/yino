import { LoaderFunctionArgs } from "@remix-run/node";
import { verify } from "~/routes/auth.verify.$token/queries";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";
import { ROUTES } from "~/routes";

export async function loader({ params }: LoaderFunctionArgs) {
  const { error } = await verify(params.token);

  if (error) {
    return await redirectWithErrorToast("/", error[0].message);
  }

  const redirectUrl = ROUTES.DASHBOARD;
  return await redirectWithToast(redirectUrl, {
    type: "success",
    text: "Your account was successfully verified!",
  });
}
