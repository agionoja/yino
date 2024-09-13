import { Form, useActionData, useNavigation } from "@remix-run/react";
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
import { redirectIfHasToken, storeTokenInSession } from "~/session.server";
import { getUser } from "~/routes/_auth-layout.auth.login/queries";
import { Button } from "~/components/button";
import { ErrorMessage } from "~/components/error";
import { useEffect, useRef } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";

export async function action({ request }: ActionFunctionArgs) {
  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "default-login": {
      const { error, data: user } = await getUser(values);

      if (user) {
        console.log({ otp: await user.generateAndSaveOtp() }); // TODO: remove this when you implement email functionality
        if (user.is2fa) return redirect("/auth/2fa");
        await storeTokenInSession(user);
        break;
      } else {
        return json({ error }, { status: error[0]?.statusCode });
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
  return await redirectIfHasToken(request);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your yino account" },
  ];
};

export default function RouteComponent() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const state = actionData?.error ? "error" : "idle";
  const isDefaultLoginSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "default-login";

  useEffect(() => {
    if (state === "error" && !isDefaultLoginSubmitting) {
      emailRef.current?.focus();
      emailRef.current?.select();
    }
  }, [isDefaultLoginSubmitting, state]);

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"email"}>
          <Input
            ref={emailRef}
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
            minLength={8}
            maxLength={80}
            required
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

      <ErrorMessage
        autoClose={true}
        showError={state === "error" && !isDefaultLoginSubmitting}
        message={actionData?.error[0].message}
      />

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
