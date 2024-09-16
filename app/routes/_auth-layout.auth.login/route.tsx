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
import { getUser } from "~/routes/_auth-layout.auth.login/queries";
import {
  getDashboardUrl,
  getUrlFromSearchParams,
  queryStringBuilder,
} from "~/utils/url";
import {
  commitSession,
  getTokenSession,
  redirectIfHaveValidToken,
  storeTokenInSession,
} from "~/session.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";
import { parseHasOtpCookie, setHasOtpCookie } from "~/cookies.server";

export async function action({ request }: ActionFunctionArgs) {
  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "default-login": {
      const { error, data: user } = await getUser(values);

      if (user) {
        const url = getUrlFromSearchParams(request.url, "redirect");
        const redirectUrl = url ? url : getDashboardUrl(user);

        if (user.is2fa) {
          console.log({ otp: await user.generateAndSaveOtp() }); // TODO: remove this when you implement email functionality

          const _2faRedirectUrl = queryStringBuilder("/auth/2fa", {
            key: "redirect",
            value: redirectUrl,
          });

          const hasOtpCookie = await parseHasOtpCookie(request);
          hasOtpCookie["hasOtp"] = true;

          // console.log({ hasOtpCookie: hasOtpCookie, _2faRedirectUrl });

          return redirectWithToast(
            _2faRedirectUrl,
            {
              text: "OTP is valid for only 2 min!",
              type: "warning",
            },
            {
              status: 200,
              headers: {
                "Set-Cookie": await setHasOtpCookie(hasOtpCookie),
                "Cache-Control": "no-cache",
              },
            },
          );
        }
        const session = await storeTokenInSession(user);

        return redirectWithToast(
          redirectUrl,
          { text: "Login successful", type: "success" },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
              "Cache-Control": "no-cache",
            },
          },
        );
      } else {
        return json({ error }, { status: error[0]?.statusCode });
      }
    }

    case "google-login": {
      return null;
    }
    default:
      return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveValidToken(request, "You are already logged in!");

  // const session = await getTokenSession(request);
  //
  // if (session.has("token")) {
  //   return redirect("/");
  // }

  return json(null, {
    headers: {
      "Cache-Control": "no-store", // Ensures the loader is run fresh each time
    },
  });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Login | Yino" },
    { name: "description", content: "Login to your yino account" },
  ];
};

export default function RouteComponent() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const error = actionData?.error;
  const previousErrorRef = useRef<typeof error | null>(null);
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "default-login";

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

        <Label label={"Password"}>
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
          aria-label={"register account"}
          type={"submit"}
          value={"default-login"}
          className={"shrink-0 bg-blue capitalize text-white"}
        >
          {isSubmitting ? "Login in..." : "Login"}
        </Button>
      </Form>

      <GoogleForm
        buttonName={"_action"}
        buttonValue={"google-login"}
        isRegister={false}
      />

      <AuthLink className={"!text-blue"} to={"/auth/register"}>
        create account
      </AuthLink>
    </>
  );
}
