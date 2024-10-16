import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/guard.server";
import { AccountHeader } from "~/routes/_account/account-header";
import { Notification } from "~/components/icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json({
    role: user.role,
    name: user.name.split(" ")[0],
    email: user.email,
    photo: user.photo,
  });
}

export default function Account() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className={"flex h-screen w-full overflow-hidden"}>
      <AccountHeader
        role={loaderData.role}
        email={loaderData.email}
        name={loaderData.name}
        // profilePhoto={loaderData.photo}
      />
      <main className={"w-full bg-alice-blue"}>
        <div className={"w-full bg-off-black px-8 py-3"}>
          <button className={"ml-auto block"}>
            <Notification size={25} color={"#ffffff"} />
          </button>
        </div>
        <div className="h-full w-full p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
