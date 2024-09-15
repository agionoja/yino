import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import React, { useEffect } from "react";
import { SocketProvider } from "~/contexts/socketContext";
import useSocketIo from "~/hooks/useSocketIo";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./tailwind.css";
import { getFlashSession } from "~/utils/toast/flash.session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { flash, headers } = await getFlashSession(request);

  // console.log({ flash, headers });

  return json({ flash }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ToastContainer
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme={"light"}
          transition={Bounce}
        />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { flash } = useLoaderData<typeof loader>();
  const { socket } = useSocketIo();

  useEffect(() => {
    if (flash?.toast) {
      toast(flash.toast.text, {
        type: flash.toast.type,
      });
    }
  }, [flash]);

  return (
    <SocketProvider socket={socket}>
      <Outlet />
    </SocketProvider>
  );
}
