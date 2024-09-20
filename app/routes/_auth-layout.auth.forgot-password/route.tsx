import { ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { Label } from "~/components/label";
import { Input } from "~/components/input";
import { Button } from "~/components/button";
import { AuthLink } from "~/components/auth-link";

export function action({ request }: ActionFunctionArgs) {
  // const em;
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
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"email"}>
          <Input
            name={"email"}
            type={"email"}
            placeholder={"hello@example.com"}
            required
          />
        </Label>
        <Button className={"bg-blue text-white"}>
          {isSubmitting ? "getting reset link" : "Password Reset link"}
        </Button>
      </Form>

      <AuthLink to={"/auth/login"}>Back to login</AuthLink>
    </>
  );
}
