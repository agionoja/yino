import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getTokenSession } from "~/session.server";
import { googleAuth } from "~/google-auth";

export async function action() {
  return googleAuth.redirectToGoogleAuth();
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getTokenSession(request);

  if (session.has("token")) {
    return redirect("/");
  }

  return googleAuth.redirectToGoogleAuth();
}
