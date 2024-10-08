import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { Label } from "~/components/label";
import { PasswordInput } from "~/components/input";
import { Button } from "~/components/button";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { AuthLink } from "~/components/auth-link";
import { resetPassword } from "~/routes/_auth.auth.reset-password.$token/queries";
import { redirectWithToast } from "~/utils/toast/flash.session.server";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getFieldError } from "~/utils/getFieldError";

export async function action({ request, params }: ActionFunctionArgs) {
  const { ...values } = Object.fromEntries(await request.formData());

  const { error } = await resetPassword(values, params.token);

  if (error) {
    return json(
      { error },
      {
        status: error[0].statusCode,
      },
    );
  }

  return await redirectWithToast("/auth/login", {
    text: "Login with your new password",
    type: "success",
  });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Reset your yino _account password" },
  ];
};

export default function ResetPassword() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.error;

  useEffect(() => {
    errors?.forEach((e) => {
      if (!e.path) {
        toast.error(e.message);
      }
    });
  }, [errors]);

  useEffect(() => {
    if (!isSubmitting && !errors) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [errors, isSubmitting]);

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"New Password"}>
          <PasswordInput
            ref={inputRef}
            name={"password"}
            minLength={8}
            validate={getFieldError("password", errors)}
            placeholder={"Enter your new password"}
            required
          />
        </Label>

        <Label label={"Confirm Password"}>
          <PasswordInput
            name={"passwordConfirm"}
            minLength={8}
            validate={getFieldError("passwordConfirm", errors)}
            placeholder={"Confirm your new password"}
            required
          />
        </Label>

        <Button disabled={isSubmitting} className={"bg-blue text-white"}>
          {isSubmitting ? "Resetting password" : "Reset password"}
        </Button>
      </Form>

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
