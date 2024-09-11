import { Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { ActionFunctionArgs, json } from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";
import { validateOtp } from "~/routes/_auth-layout.auth.2fa/queries";
import { storeTokenInSession } from "~/session.server";
import { AuthLink } from "~/components/auth-link";

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
        status: error?.statusCode,
      },
    );
  }
}

export default function RouteComponent() {
  const [inputValue, setInputValue] = useState("");
  const navigation = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isSubmitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only digits and restrict length to 6
    if (/^\d*$/.test(value) && value.length <= 6) {
      setInputValue(value);
    }
  };

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    // Customize the browser's default validation message
    e.currentTarget.setCustomValidity("Please enter a 6-digit numeric code.");
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Reset custom validation message if input becomes valid
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
          {isSubmitting ? "Login in..." : "Login"}
        </Button>
      </Form>

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
