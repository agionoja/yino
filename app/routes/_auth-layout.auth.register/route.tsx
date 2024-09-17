import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Input, PasswordInput } from "~/components/input";
import { Label } from "~/components/label";
import { Button } from "~/components/button";
import { GoogleForm } from "~/components/google-form";
import { AuthLink } from "~/components/auth-link";
import { createUser } from "~/routes/_auth-layout.auth.register/queries";
import {
  commitSession,
  redirectIfHaveValidSessionToken,
  storeTokenInSession,
} from "~/session.server";
import { redirectWithToast } from "~/utils/toast/flash.session.server";
import { getDashboardUrl } from "~/utils/url";

export async function action({ request }: ActionFunctionArgs) {
  const { ...values } = Object.fromEntries(await request.formData());

  const { error, data: user } = await createUser(values);

  if (user) {
    const session = await storeTokenInSession(user);

    return redirectWithToast(
      getDashboardUrl(user),
      { text: "Registered successfully", type: "success" },
      {
        status: 201,
        headers: {
          "Set-cookie": await commitSession(session),
        },
      },
    );
  } else {
    return json({ error }, { status: error[0]?.statusCode });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfHaveValidSessionToken(
    request,
    "You already have an account!",
  );
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Register | Yino" },
    { name: "description", content: "Register your yino account" },
  ];
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const getFieldError = (name: string) => {
    const error = actionData?.error?.find((e) => e.path === name);
    return error
      ? {
          message: error.message,
          isValid: false,
        }
      : {
          isValid: true,
        };
  };

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"name"}>
          <Input
            name={"name"}
            validate={{ ...getFieldError("name") }}
            type={"text"}
            placeholder={"Daniel Arinze"}
            required
            minLength={4}
          />
        </Label>

        <Label label={"email"}>
          <Input
            name={"email"}
            validate={{ ...getFieldError("email") }}
            type={"email"}
            placeholder={"hello@example.com"}
            required
          />
        </Label>

        <Label label={"phone number"}>
          <Input
            type={"tel"}
            name={"phoneNumber"}
            validate={{ ...getFieldError("phoneNumber") }}
            placeholder={"08182398732"}
            required
            minLength={10}
            maxLength={11}
          />
        </Label>

        <Label label={"password"}>
          <PasswordInput
            name={"password"}
            validate={{ ...getFieldError("password") }}
            aria-label={"register password"}
            placeholder={"Your Password"}
          />
        </Label>

        <Label label={"confirm password"}>
          <PasswordInput
            name={"passwordConfirm"}
            validate={{ ...getFieldError("passwordConfirm") }}
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
            aria-label={"register account"}
            type={"submit"}
            className={"shrink-0 bg-blue capitalize text-white"}
          >
            {isSubmitting ? "registering..." : "register"}
          </Button>
        </div>
      </Form>

      <GoogleForm
        action={"/auth/google-auth?action=register"}
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
