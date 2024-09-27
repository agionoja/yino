import { Outlet } from "@remix-run/react";
import Footer from "~/components/footer";

export default function Landing() {
  return (
    <div>
      <header>
        <nav></nav>
      </header>
      <main>{<Outlet />}</main>
      <Footer />
    </div>
  );
}
