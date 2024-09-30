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
  redirect,
} from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";
import { resendOtp, validateOtp } from "~/routes/_auth.auth.2fa/queries";
import {
  commitSession,
  redirectIfHaveSession,
  storeTokenInSession,
} from "~/session.server";
import { AuthLink } from "~/components/auth-link";
import { getDashboardUrl, getUrlFromSearchParams } from "~/utils/url";
import { toast } from "react-toastify";
import { parseOtpCookie } from "~/cookies.server";
import {
  redirectWithErrorToast,
  redirectWithToast,
} from "~/utils/toast/flash.session.server";
import { logDevError } from "~/utils/dev.console";

export async function action({ request }: ActionFunctionArgs) {
  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "otp": {
      const { error, data: user } = await validateOtp(values.otp);

      if (user) {
        const session = await storeTokenInSession(user);

        const url = getUrlFromSearchParams(request.url, "redirect");
        const redirectUrl = url ? url : getDashboardUrl(user);

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
        return json(
          { error },
          {
            status: error[0]?.statusCode,
          },
        );
      }
    }

    case "resend": {
      const otpCookie = await parseOtpCookie(request);
      const { error } = await resendOtp(otpCookie?._id);

      if (error) {
        logDevError(error);
        return await redirectWithErrorToast(
          "/auth/2fa",
          "There was an error resending the OTP",
        );
      }

      return await redirectWithToast("/auth/2fa", {
        text: "Check your email for your OTP",
        type: "success",
      });
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveSession(request, "You are already logged in!");

  const otpCookie = await parseOtpCookie(request);

  if (!otpCookie._id) {
    return redirect(
      "/auth/login",
      // "You have to login in first",
    );
  }

  return json({ userId: otpCookie?._id });
}

export const meta: MetaFunction = () => {
  return [
    { title: "2FA | Yino" },
    { name: "description", content: "Two Factor Verification" },
    { httpEquiv: "refresh", content: "1800 url=/auth/login" },
  ];
};

export default function _2FA() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const { userId = undefined } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement>(null);
  const previousErrorRef = useRef<typeof error | null>(null);
  const hasShownToast = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [counter, setCounter] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "otp";
  const isResendingOtp =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "resend";
  const error = actionData?.error;

  useEffect(() => {
    const hasNewError = error && error !== previousErrorRef.current;
    if (!isSubmitting && hasNewError) {
      toast(error[0].message, { type: "error" });
    }

    previousErrorRef.current = error;
  }, [error, isSubmitting]);

  useEffect(() => {
    if (!hasShownToast.current) {
      toast("Check your email for your OTP", { type: "info" });
      hasShownToast.current = true;
    }
  }, [userId, navigation.state]);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isSubmitting]);

  // Countdown logic for disabling resend button
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isDisabled && counter > 0) {
      timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
    } else if (counter === 0) {
      setIsDisabled(false);
      setCounter(30);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [counter, isDisabled]);

  useEffect(() => {
    if (isResendingOtp) {
      setIsDisabled(true);
    }
  }, [isResendingOtp]);

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
          name={"_action"}
          value={"otp"}
          aria-label={"submit otp"}
          disabled={isSubmitting}
          className={"bg-blue"}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </Form>

      <Form className={"w-full"} method={"POST"}>
        <button
          disabled={isDisabled || isResendingOtp}
          name={"_action"}
          value={"resend"}
          className={"ml-auto block w-fit text-sm text-gray-500"}
          type={"submit"}
        >
          {isDisabled ? `Resend in (${counter})` : "Resend"}
        </button>
      </Form>

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
