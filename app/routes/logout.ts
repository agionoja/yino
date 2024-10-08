import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getTokenSession } from "~/session.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getTokenSession(request);

  return session.has("token")
    ? await redirectWithToast(
        "/auth/login",
        { text: "Goodbye ✋✋✋", type: "success" },
        {
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        },
      )
    : redirect("/auth/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
}
