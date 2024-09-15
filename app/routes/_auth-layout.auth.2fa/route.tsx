import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";
import { validateOtp } from "~/routes/_auth-layout.auth.2fa/queries";
import {
  commitSession,
  redirectIfHaveValidToken,
  storeTokenInSession,
} from "~/session.server";
import { AuthLink } from "~/components/auth-link";
import { getDashboardUrl, getUrlFromSearchParams } from "~/utils/url";
import { toast } from "react-toastify";
import { parseHasOtpCookie } from "~/cookies.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const otp = formData.get("otp");

  const { error, data: user } = await validateOtp(otp);

  if (user) {
    const session = await storeTokenInSession(user);

    const url = getUrlFromSearchParams(request.url, "redirect");
    const redirectUrl = url ? url : getDashboardUrl(user);

    return redirectWithToast(
      redirectUrl,
      { text: "2FA successful", type: "success" },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  } else {
    return json(
      { error },
      {
        status: error[0]?.statusCode,
      },
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveValidToken(request);

  const hasOtp = await parseHasOtpCookie(request);

  return json({ hasOtp: hasOtp.hasOtp });
}

export const meta: MetaFunction = () => {
  return [
    { title: "2FA | Yino" },
    { name: "description", content: "Two Factor Verification" },
  ];
};

export default function RouteComponent() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const { hasOtp } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasShownToast = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const isSubmitting = navigation.state === "submitting";
  const error = actionData?.error;
  const previousErrorRef = useRef<typeof error | null>(null);

  useEffect(() => {
    const hasNewError = error && error !== previousErrorRef.current;
    if (!isSubmitting && hasNewError) {
      toast(error[0].message, { type: "error" });
    }

    previousErrorRef.current = error;
  }, [error, isSubmitting]);

  useEffect(() => {
    if (hasOtp && !hasShownToast.current) {
      toast("Check your email for your OTP", { type: "info" });
      hasShownToast.current = true;
    }
  }, [hasOtp, navigation.state]);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isSubmitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setInputValue(value);
    }
  };
  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("Please enter a 6-digit numeric code.");
  };
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("");
  };

  return (
    <>
      <Form method={"POST"} className={"auth-form"}>
        <Input
          ref={inputRef}
          name={"otp"}
          type="text"
          id="otp"
          inputMode={"numeric"}
          pattern="\d{6}"
          maxLength={6}
          placeholder={"Enter 6-digit OTP"}
          required
          value={inputValue}
          onChange={handleChange}
          onInput={handleInput}
          onInvalid={handleInvalid}
        />
        <Button
          aria-label={"submit otp"}
          disabled={isSubmitting}
          className={"bg-blue"}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </Form>

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
