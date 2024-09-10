import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { createUser } from "~/routes/_auth-layout.auth.register/queries";
import { getTokenSession, storeTokenInSession } from "~/session.server";
import { Input, PasswordInput } from "~/components/input";
import { Label } from "~/components/label";
import { Button } from "~/components/button";
import { GoogleForm } from "~/components/google-form";
import { AuthLink } from "~/components/auth-link";

export const meta: MetaFunction = () => {
  return [
    { title: "Register Account" },
    { name: "description", content: "Register your yino account" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getTokenSession(request);

  if (session.has("token")) return redirect("/");

  const { _action, ...values } = Object.fromEntries(await request.formData());

  switch (_action) {
    case "default-register": {
      const { error, data: user } = await createUser(values);

      if (user) {
        console.log(`User form the register route: `, user);

        const cookie = await storeTokenInSession(user);

        console.log({ cookie: cookie });
        return null;
        // return redirect("/");
      } else {
        return json({ error }, { status: error?.statusCode });
      }
    }

    case "google-register": {
      return null;
    }
  }
}

export default function RouteComponent() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isDefaultRegisterSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "normal-register";

  console.log(`Action data is ${actionData}`);

  return (
    <>
      <Form method="POST" className={"auth-form"}>
        <Label label={"name"}>
          <Input
            name={"name"}
            type={"text"}
            placeholder={"Daniel Arinze"}
            required
            minLength={4}
          />
        </Label>

        <Label label={"email"}>
          <Input
            name={"email"}
            type={"email"}
            placeholder={"hello@example.com"}
            required
          />
        </Label>

        <Label label={"phone number"}>
          <Input
            type={"tel"}
            name={"phoneNumber"}
            placeholder={"08182398732"}
            required
            minLength={10}
            maxLength={11}
          />
        </Label>

        <Label label={"password"}>
          <PasswordInput
            name={"password"}
            aria-label={"register password"}
            placeholder={"Your Password"}
          />
        </Label>

        <Label label={"confirm password"}>
          <PasswordInput
            name={"passwordConfirm"}
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
            disabled={isDefaultRegisterSubmitting}
            name={"_action"}
            aria-label={"register account"}
            type={"submit"}
            value={"default-register"}
            className={"shrink-0 bg-blue capitalize text-white"}
          >
            {isDefaultRegisterSubmitting ? "registering" : "register"}
          </Button>
        </div>
      </Form>

      <GoogleForm isRegister={true} />

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
