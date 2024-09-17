import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { redirectIfHaveValidSessionToken } from "~/session.server";
import { getUrlFromSearchParams } from "~/utils/url";
import appConfig from "../../../app.config";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";
import { findOrCreateUser } from "~/routes/auth.google-auth/queries";
import { parseAuthCbCookie, serializeAuthCbCookie } from "~/cookies.server";

// type AuthAction = "auth_callback_action";

const redirectUrl = (isLogin: boolean) =>
  isLogin ? "/auth/login" : "/auth/register";

const defaultErrMsg = (isLogin: boolean) =>
  `There was a problem with ${isLogin ? "login you in" : "your registration"}`;

const googleAuthOptions = {
  client_id: appConfig.googleClientId!,
  redirect_uri: `${appConfig.nodeEnv === "production" ? appConfig.onlineHost : `http://${appConfig.localHost}:${appConfig.port}`}/auth/google-auth`,
  response_type: "code",
  scope: "openid email profile",
  access_type: "offline",
} as const;

export async function action({ request }: ActionFunctionArgs) {
  const isLogin = getUrlFromSearchParams(request.url, "action") === "login";

  await serializeAuthCbCookie({
    auth_callback_action: isLogin ? "login" : "register",
  });

  const params = new URLSearchParams(googleAuthOptions);

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
export async function loader({ request }: LoaderFunctionArgs) {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // code in this block is what will run before Google auth redirect
  let state = getUrlFromSearchParams(request.url, "action") as
    | "login"
    | "register";

  console.log({ initialState: state });
  const message =
    state === "login"
      ? "You are already logged in! "
      : "You already have an account!";

  await redirectIfHaveValidSessionToken(request, message);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  // At this point, Google has redirected us and our state has changed
  const googleAuthCode = getUrlFromSearchParams(request.url, "code");

  const { auth_callback_action } = await parseAuthCbCookie(request);
  state = auth_callback_action;

  if (!googleAuthCode) {
    return await redirectWithToast(redirectUrl(state === "login"), {
      text: defaultErrMsg(state === "login"),
      type: "error",
    });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        ...googleAuthOptions,
        grant_type: "authorization_code",
        code: googleAuthCode,
        client_secret: `${appConfig.googleClientSecret}`,
      }),
    });

    const token = await tokenRes.json();

    if (token) {
      try {
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          },
        );

        const userInfo = await userInfoRes.json();

        const {
          id = undefined,
          email = undefined,
          verified_email = undefined,
        } = userInfo;

        const {
          error,

          data: user,
        } = await findOrCreateUser({
          id,
          email,
          name: userInfo.name,
          verified: verified_email,
        });

        if (error) {
          return await redirectWithErrorToast(
            redirectUrl(state === "login"),
            defaultErrMsg(state === "login"),
          );
        }

        console.log({ error, user });

        console.log("userInfo", userInfo);
      } catch (err) {
        console.log(err);
        return await redirectWithErrorToast(
          redirectUrl(state === "login"),
          defaultErrMsg(state === "login"),
        );
      }
    } else {
      return await redirectWithErrorToast(
        redirectUrl(state === "login"),
        defaultErrMsg(state === "login"),
      );
    }
  } catch (err) {
    console.log(err);
    return await redirectWithErrorToast(
      redirectUrl(state === "login"),
      defaultErrMsg(state === "login"),
    );
  }

  console.log({ cookieState: state });
  return await redirectWithErrorToast(
    redirectUrl(state === "login"),
    defaultErrMsg(state === "login"),
  );
}
