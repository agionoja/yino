import { Outlet } from "@remix-run/react";

export default function Landing() {
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
