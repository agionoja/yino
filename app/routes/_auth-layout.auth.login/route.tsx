import { Form, Link } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Input, PasswordInput } from "~/components/input";
import { Label } from "~/components/label";
import { GoogleForm } from "~/components/google-form";
import { AuthLink } from "~/components/auth-link";

export function action({ request }: ActionFunctionArgs) {
  return null;
}

export function loader({ request }: LoaderFunctionArgs) {
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your yino account" },
  ];
};

export default function RouteComponent() {
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

        <Label label={"Password"}>
          <PasswordInput
            name={"password"}
            aria-label={"register password"}
            placeholder={"Your Password"}
          />
        </Label>
      </Form>

      <GoogleForm isRegister={false} />

      <AuthLink className={"!text-blue"} to={"/auth/register"}>
        create account
      </AuthLink>
    </>
  );
}
