import { Outlet } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/guard.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json({ user });
}

export default function Account() {
  return (
    <>
      <Outlet />
    </>
  );
}
