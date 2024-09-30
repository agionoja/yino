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
    photo: user.profilePhoto,
  });
}

export default function Account() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className={"flex min-h-screen w-full"}>
      <AccountHeader
        role={loaderData.role}
        email={loaderData.email}
        name={loaderData.name}
        profilePhoto={loaderData.photo}
      />
      <main className={"bg-alice-blue min-h-full w-full"}>
        <div className={"bg-eerie-black w-full px-8 py-3"}>
          <button className={"ml-auto block"}>
            <Notification size={25} color={"#ffffff"} />
          </button>
        </div>
        <div className="w-full p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
