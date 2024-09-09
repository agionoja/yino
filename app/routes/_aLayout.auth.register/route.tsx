import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createUser } from "~/routes/_aLayout.auth.register/queries";
import { storeTokenInSession } from "~/session.server";
import { Form } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const { data: user, error } = await createUser(await request.formData());

  if (user) {
    await storeTokenInSession(user);
    return redirect("/");
  } else {
    return json({ error }, { status: error?.statusCode });
  }
}

export default function Route() {
  return (
    <>
      <Form method="POST" className={"w-full"}>
        <label>
          <span>Name</span>
          <input
            className={
              "w-full border py-4 px-4 rounded-lg border-[#d0d5dd] focus:border-[#4b5768] focus:shadow transition duration-200 focus:outline-none"
            }
            type="text"
            aria-label={"name"}
            placeholder={"Daniel Arinze"}
            required
            minLength={4}
          />
        </label>
      </Form>
    </>
  );
}
