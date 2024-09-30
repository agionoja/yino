import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { Input, PasswordInput } from "~/components/input";
import { Label } from "~/components/label";
import { GoogleForm } from "~/components/google-form";
import { AuthLink } from "~/components/auth-link";
import { Button } from "~/components/button";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getUser } from "~/routes/_auth.auth.login/queries";
import {
  getDashboardUrl,
  getUrlFromSearchParams,
  queryStringBuilder,
} from "~/utils/url";
import {
  commitSession,
  redirectIfHaveSession,
  storeTokenInSession,
} from "~/session.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";
import {
  parseAuthCbCookie,
  parseOtpCookie,
  serializeAuthCbCookie,
  serializeOtpCookie,
} from "~/cookies.server";
import asyncOperationHandler from "~/utils/async.operation";
import Email from "~/utils/email";
import appConfig from "../../../app.config";
import { logDevError, logDevInfo } from "~/utils/dev.console";

export async function action({ request }: ActionFunctionArgs) {
  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "login": {
      const { error, data: user } = await getUser(values);

      if (user) {
        const url = getUrlFromSearchParams(request.url, "redirect");
        const redirectUrl = url ? url : getDashboardUrl(user);

        if (user.is2fa) {
          const otp = await user.generateAndSaveOtp();

          const { error: otpError } = await asyncOperationHandler(async () => {
            await new Email(user).sendOtp(otp);
          });

          if (otpError) {
            await user.destroyOtpAndSAve();
            logDevError(otpError);
          }

          if (appConfig.nodeEnv !== "production") {
            logDevInfo({ otp });
          }

          const _2faRedirectUrl = queryStringBuilder("/auth/2fa", {
            key: "redirect",
            value: redirectUrl,
          });

          const otpCookie = await parseOtpCookie(request);
          otpCookie["_id"] = user.id;

          return await redirectWithToast(
            _2faRedirectUrl,
            {
              text: "OTP is valid for only 2 min!",
              type: "warning",
            },
            {
              headers: {
                "Set-Cookie": await serializeOtpCookie(otpCookie),
              },
            },
          );
        }
        const session = await storeTokenInSession(user);

        return await redirectWithToast(
          redirectUrl,
          { text: "Welcome back!", type: "success" },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          },
        );
      } else {
        return json({ error }, { status: error[0]?.statusCode });
      }
    }

    case "google-auth": {
      const url = getUrlFromSearchParams(request.url, "redirect");
      const cookie = await parseAuthCbCookie(request);
      cookie["authCallbackAction"] = "login";
      cookie["redirectUrl"] = url || "/";

      return redirect("/auth/google-auth", {
        headers: {
          "Set-Cookie": await serializeAuthCbCookie(cookie),
        },
      });
    }

    default:
      return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveSession(request, "You are already logged in!");
  return json(null);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Login | Yino" },
    { name: "description", content: "Login to your yino account" },
  ];
};

export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const error = actionData?.error;
  const previousErrorRef = useRef<typeof error | null>(null);
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "login";

  useEffect(() => {
    const hasNewError = error && error !== previousErrorRef.current;

    if (error || !isSubmitting) {
      emailRef.current?.focus();
      emailRef.current?.select();
    }

    if (hasNewError) {
      toast(error[0].message, { type: "error", autoClose: 2000 });
    }

    previousErrorRef.current = error;
  }, [error, isSubmitting]);

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"email"}>
          <Input
            ref={emailRef}
            name={"email"}
            type={"email"}
            placeholder={"hello@example.com"}
            required
          />
        </Label>

        <Label
          label={"Password"}
          extraElement={
            <AuthLink
              to={"/auth/forgot-password"}
              className={"text-sm text-blue no-underline"}
            >
              Forgot Password?
            </AuthLink>
          }
        >
          <PasswordInput
            name={"password"}
            aria-label={"register password"}
            placeholder={"Your Password"}
            minLength={8}
            maxLength={80}
            required
          />
        </Label>

        <Button
          disabled={isSubmitting}
          name={"_action"}
          value={"login"}
          aria-label={"register account"}
          type={"submit"}
          className={"shrink-0 bg-blue capitalize text-white"}
        >
          {isSubmitting ? "Login in..." : "Login"}
        </Button>
      </Form>

      <GoogleForm
        method={"POST"}
        btnName={"_action"}
        btnValue={"google-auth"}
        isRegister={false}
      />

      <AuthLink className={"!text-blue"} to={"/auth/register"}>
        create account
      </AuthLink>
    </>
  );
}
