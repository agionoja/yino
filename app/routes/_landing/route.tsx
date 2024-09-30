import { Outlet } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getTokenSession } from "~/session.server";
import Header from "~/components/header";
import Footer from "~/components/footer";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getTokenSession(request);
  const isLoggedIn = session.has("token");

  return json({ isLoggedIn });
}

export default function Landing() {
  // const { isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <div>
      <Header />
      <main>{<Outlet />}</main>
      <Footer />
    </div>
  );
}
