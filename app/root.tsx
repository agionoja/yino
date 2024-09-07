import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import React from "react";
import { SocketProvider } from "~/contexts/socketContext";
import useSocketIo from "~/hooks/useSocketIo";

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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { socket } = useSocketIo();

  return (
    <SocketProvider socket={socket}>
      <Outlet />
    </SocketProvider>
  );
}
