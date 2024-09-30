import { Outlet } from "@remix-run/react";

export default function Settings() {
  return (
    <>
      <h1>This is the settings routes</h1>
      <Outlet />
    </>
  );
}
