import { Form, FormProps } from "@remix-run/react";
import { Button } from "~/components/button";
import googleIcon from "~/assets/icons/google.svg";

interface Props extends FormProps {
  isRegister: boolean;
}

export function GoogleForm({
  isRegister,

  ...props
}: Props) {
  return (
    <>
      <div className="my-4 flex items-center px-6 md:px-10">
        <div className="flex-grow border-t border-french-gray"></div>
        <span className="relative mx-4 text-sm text-gray-500">
          or {isRegister ? "register" : "login"} with Google
        </span>
        <div className="flex-grow border-t border-french-gray"></div>
      </div>

      <Form {...props} method={"POST"}>
        <Button
          aria-label={"register with google"}
          type={"submit"}
          className={"bg-anti-flash-white !text-gray-500"}
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
