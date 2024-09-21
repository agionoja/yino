import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Label } from "~/components/label";
import { Input } from "~/components/input";
import { Button } from "~/components/button";
import { AuthLink } from "~/components/auth-link";
import { sendPasswordResetToken } from "~/routes/_auth-layout.auth.forgot-password/queries";
import { redirectWithToast } from "~/utils/toast/flash.session.server";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { error, data } = await sendPasswordResetToken(formData.get("email"));

  if (error) {
    return json({ error }, { status: error[0].statusCode });
  }

  // TODO: make sure to remove this redirect after you set up email

  if (data?.ok) {
    return await redirectWithToast(data.passwordResetURL, {
      text: "Check your email for your password reset link",
      type: "info",
    });
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Forgot Password" },
    {
      name: "description",
      content:
        "Forget your yino account password? Enter your email for a reset link",
    },
  ];
};

export default function ForgotPassword() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);
  const error = actionData?.error;
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (error) {
      toast.error(error[0].message);
    }
  }, [error]);

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"email"}>
          <Input
            name={"email"}
            ref={inputRef}
            type={"email"}
            placeholder={"hello@example.com"}
            required
          />
        </Label>
        <Button disabled={isSubmitting} className={"bg-blue text-white"}>
          {isSubmitting ? "getting reset link..." : "Password Reset link"}
        </Button>
      </Form>

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
