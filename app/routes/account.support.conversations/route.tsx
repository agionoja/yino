import { Outlet } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser, restrictTo } from "~/guard.server";
import { toast } from "react-toastify";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  console.log({ user });

  await restrictTo(user, request, "admin");
  return null;
}

export default function Conversation() {
  const notify = () => {
    toast.error("Wow so easy!");
  };

  return (
    <>
      <h1>This is the conversation route</h1>
      <button onClick={notify}>click</button>
      <Outlet />
    </>
  );
}
