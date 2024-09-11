import { Form, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { Input, PasswordInput } from "~/components/input";
import { Label } from "~/components/label";
import { GoogleForm } from "~/components/google-form";
import { AuthLink } from "~/components/auth-link";
import { hasTokenSession, storeTokenInSession } from "~/session.server";
import { getUser } from "~/routes/_auth-layout.auth.login/queries";
import { Button } from "~/components/button";

export async function action({ request }: ActionFunctionArgs) {
  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "default-login": {
      const { error, data: user } = await getUser(values);

      if (user) {
        if (user.is2fa) return redirect("/auth/2fa");
        await storeTokenInSession(user);
        break;
      } else {
        return json({ error }, { status: error?.statusCode });
      }
    }

    case "google-login": {
      return null;
    }
    default:
      return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await hasTokenSession(request);

  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your yino account" },
  ];
};

export default function RouteComponent() {
  const navigation = useNavigation();
  const isDefaultLoginSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "default-login";

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

        <Button
          disabled={isDefaultLoginSubmitting}
          name={"_action"}
          aria-label={"register account"}
          type={"submit"}
          value={"default-login"}
          className={"shrink-0 bg-blue capitalize text-white"}
        >
          {isDefaultLoginSubmitting ? "Login in..." : "Login"}
        </Button>
      </Form>

      <GoogleForm
        buttonName={"_action"}
        buttonValue={"google-login"}
        isRegister={false}
      />

      <AuthLink className={"!text-blue"} to={"/auth/register"}>
        create account
      </AuthLink>
    </>
  );
}
