import { ActionFunctionArgs } from "@remix-run/node";

export function action({ request }: ActionFunctionArgs) {
  console.log(request);
}
