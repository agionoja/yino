import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";
import { validateOtp } from "~/routes/_auth-layout.auth.2fa/queries";
import { redirectIfHasToken, storeTokenInSession } from "~/session.server";
import { AuthLink } from "~/components/auth-link";
import { ErrorMessage } from "~/components/error";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const otp = formData.get("otp");

  const { error, data: user } = await validateOtp(otp);

  if (user) {
    await storeTokenInSession(user);
  } else {
    return json(
      { error },
      {
        status: error[0]?.statusCode,
      },
    );
  }
}

export default function RouteComponent() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>(); // Get action data, including errors
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const isSubmitting = navigation.state === "submitting";
  const errorMessage = actionData?.error ? actionData.error[0].message : null;
  const errorPath = actionData?.error ? actionData.error[0].path : null;

  const state = actionData?.error ? "error" : "idle";

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

  // If the error path matches "otp", you can focus on the input field
  useEffect(() => {
    if (errorPath === "otp" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [errorPath]);

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

      {errorMessage && (
        <ErrorMessage
          showError={state === "error" && !isSubmitting}
          message={errorMessage}
        />
      )}

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
