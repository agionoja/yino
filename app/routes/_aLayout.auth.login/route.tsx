import { Form } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export function action({ request }: ActionFunctionArgs) {}

export function loader({ request }: LoaderFunctionArgs) {}

export default function Login() {
  return (
    <div>
      <Form method="POST">
        <label>
          <span>Name</span>
          <input
            type="text"
            aria-label={"name"}
            placeholder={"Daniel Arinze"}
            required
            minLength={4}
          />
        </label>
      </Form>
    </div>
  );
}
