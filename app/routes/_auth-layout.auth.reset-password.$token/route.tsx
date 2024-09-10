import { ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Label } from "~/components/label";
import { PasswordInput } from "~/components/input";
import { Button } from "~/components/button";
import { Form, useNavigation } from "@remix-run/react";
import { AuthLink } from "~/components/auth-link";

export function action({ request }: ActionFunctionArgs) {
  return request;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Reset your yino account password" },
  ];
};

export default function RouteComponent() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"New Password"}>
          <PasswordInput
            name={"password"}
            type={"password"}
            placeholder={"Enter your new password"}
            required
          />
        </Label>

        <Label label={"Confirm Password"}>
          <PasswordInput
            name={"passwordConfirm"}
            type={"password"}
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
