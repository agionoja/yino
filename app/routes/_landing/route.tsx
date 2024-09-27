<<<<<<< HEAD
import { Outlet } from "@remix-run/react";
import Footer from "~/components/footer";
import Header from "~/components/header";
=======
import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getTokenSession } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getTokenSession(request);
  const isLoggedIn = session.has("token");

  return json({ isLoggedIn });
}
>>>>>>> d2c9dd38e49dcb2fd1ccd7c8d5752ef16e3062bf

export default function Landing() {
  const { isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <div>
      <Header />
      <main>{<Outlet />}</main>
      <Footer />
    </div>
  );
}
