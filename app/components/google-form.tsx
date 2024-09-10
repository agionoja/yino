import { Form } from "@remix-run/react";
import { Button } from "~/components/button";
import googleIcon from "~/assets/icons/google.svg";
import React from "react";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  isRegister: boolean;
}

export function GoogleForm({ isRegister }: Props) {
  return (
    <>
      <div className="my-4 flex items-center px-6 md:px-10">
        <div className="flex-grow border-t border-french-gray"></div>
        <span className="relative mx-4 text-sm text-gray-500">
          or {isRegister ? "register" : "login"} with Google
        </span>
        <div className="flex-grow border-t border-french-gray"></div>
      </div>

      <Form method={"POST"}>
        <Button
          aria-label={"register with google"}
          type={"submit"}
          name={"_action"}
          value={"google-register"}
          className={"bg-anti-flash-white"}
        >
          <div className={"flex justify-center gap-3"}>
            <img src={googleIcon} alt="google icon" />
            <span>Continue with Google</span>
          </div>
        </Button>
      </Form>
    </>
  );
}
