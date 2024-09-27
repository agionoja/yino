import { Outlet } from "@remix-run/react";
import Footer from "~/components/footer";
import Header from "~/components/header";

export default function Landing() {
  return (
    <div>
      <Header />
      <main>{<Outlet />}</main>
      <Footer />
    </div>
  );
}
