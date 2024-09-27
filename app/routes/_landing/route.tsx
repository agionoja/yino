import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getTokenSession } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getTokenSession(request);
  const isLoggedIn = session.has("token");

  return json({ isLoggedIn });
}

export default function Landing() {
  const { isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <div>
      <header>
        <nav></nav>
      </header>
      <main>{<Outlet />}</main>
      <footer></footer>
    </div>
  );
}
