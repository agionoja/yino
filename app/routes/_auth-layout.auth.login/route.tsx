import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
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
  redirectIfHaveValidSessionToken,
  storeTokenInSession,
} from "~/session.server";
import { replaceWithToast } from "~/utils/toast/flash.session.server";
import { parseHasOtpCookie, serializeHasOtpCookie } from "~/cookies.server";

export async function action({ request }: ActionFunctionArgs) {
  const { ...values } = Object.fromEntries(await request.formData());
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

      return replaceWithToast(
        _2faRedirectUrl,
        {
          text: "OTP is valid for only 2 min!",
          type: "warning",
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": await serializeHasOtpCookie(hasOtpCookie),
          },
        },
      );
    }
    const session = await storeTokenInSession(user);

    return replaceWithToast(
      redirectUrl,
      { text: "Logged in successfully", type: "success" },
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

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveValidSessionToken(request, "You are already logged in!");
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
  const isSubmitting = navigation.state === "submitting";

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
        action={"/auth/google-auth?action=login"}
        method={"POST"}
        isRegister={false}
      />

      <AuthLink className={"!text-blue"} to={"/auth/register"}>
        create account
      </AuthLink>
    </>
  );
}
