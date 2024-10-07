import { Outlet } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getTokenSession } from "~/session.server";
import Footer from "~/components/footer";
import Container from "~/components/container";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getTokenSession(request);
  const isLoggedIn = session.has("token");

  return json({ isLoggedIn });
}

export default function Landing() {
  // const { isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <div>
      <Container />
      <main>{<Outlet />}</main>
      <Footer />
    </div>
  );
}
