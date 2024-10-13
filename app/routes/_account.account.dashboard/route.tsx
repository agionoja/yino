import { json, LoaderFunctionArgs } from "@remix-run/node";
import { requireUser, restrictTo } from "~/guard.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  await restrictTo(user, request, user.role);
  return json({ user });
}

export default function Dashboard() {
  return (
    <>
      <h1>This is the dashboard route</h1>
    </>
  );
}
