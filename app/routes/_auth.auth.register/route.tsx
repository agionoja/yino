import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { Input, PasswordInput } from "~/components/input";
import { Label } from "~/components/label";
import { Button } from "~/components/button";
import { GoogleForm } from "~/components/google-form";
import { AuthLink } from "~/components/auth-link";
import { createUser } from "~/routes/_auth.auth.register/queries";
import { createUserSession, redirectIfHaveSession } from "~/session.server";
import { getBaseUrl, getUrlFromSearchParams } from "~/utils/url";
import { parseAuthCbCookie, serializeAuthCbCookie } from "~/cookies.server";
import { getFieldError } from "~/utils/getFieldError";
import { logDevError } from "~/utils/dev.console";
import { ROUTES } from "~/routes";

export async function action({ request }: ActionFunctionArgs) {
  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "register": {
      const baseUrl = getBaseUrl(request);
      const { error, data: user } = await createUser(values, baseUrl);

      if (user) {
        return await createUserSession({
          user,
          redirectTo: ROUTES.DASHBOARD,
          message: "Welcome to Yino!",
        });
      } else {
        logDevError(error);
        return json({ error }, { status: error[0]?.statusCode });
      }
    }
    case "google-auth": {
      const cookie = await parseAuthCbCookie(request);
      const redirectTo = getUrlFromSearchParams(request.url, "redirect");

      cookie["authCallbackAction"] = "register";
      cookie["redirectUrl"] = redirectTo || "/";

      return redirect("/auth/google-auth", {
        headers: {
          "Set-Cookie": await serializeAuthCbCookie(cookie),
        },
      });
    }

    default:
      return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveSession(request);
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Register | Yino" },
    { name: "description", content: "Register your yino _account" },
  ];
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const error = actionData?.error;
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "register";

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"name"}>
          <Input
            name={"name"}
            validate={getFieldError("name", error)}
            type={"text"}
            placeholder={"Daniel Arinze"}
            required
            minLength={4}
          />
        </Label>

        <Label label={"email"}>
          <Input
            name={"email"}
            validate={getFieldError("email", error)}
            type={"email"}
            placeholder={"hello@example.com"}
            required
          />
        </Label>

        <Label label={"password"}>
          <PasswordInput
            name={"password"}
            validate={getFieldError("password", error)}
            aria-label={"register password"}
            placeholder={"Your Password"}
          />
        </Label>

        <Label label={"confirm password"}>
          <PasswordInput
            name={"passwordConfirm"}
            validate={getFieldError("passwordConfirm")}
            aria-label={"register password confirmation"}
            placeholder={"Your Password"}
          />
        </Label>

        <div className={"flex flex-col gap-5"}>
          <span className={"text-sm"}>
            By continuing, you agree to our{" "}
            <Link className={"text-[#2776ea]"} to={"/"}>
              terms of service
            </Link>
            .
          </span>
          <Button
            disabled={isSubmitting}
            aria-label={"register _account"}
            type={"submit"}
            name={"_action"}
            value={"register"}
            className={"shrink-0 bg-blue capitalize text-white"}
          >
            {isSubmitting ? "registering..." : "register"}
          </Button>
        </div>
      </Form>

      <GoogleForm
        btnValue={"google-auth"}
        btnName={"_action"}
        isRegister={true}
      />

      <div className={"flex justify-center"}>
        <span>
          Already have an account?
          <AuthLink className={"!text-blue"} to={"/auth/login"}>
            {" "}
            Login here
          </AuthLink>
        </span>
      </div>
    </>
  );
}
