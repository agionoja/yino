import { createServer } from "node:http";
import "dotenv/config.js";
import crone from "node-cron";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import socket from "./socket/socket.js";
import appConfig from "./app.config.js";

crone.schedule("* * * * * *", async () => {
  try {
    const res = await fetch("https://yino.onrender.com/api/spin", {
      method: "GET",
    });
    const awaitedJson = await res.json();
    console.log(awaitedJson);
  } catch (err) {
    console.error(`There was an error with the crone job: ${err}`);
  }
});

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

const httpServer = createServer(app);

// This is an abstraction of the socket implementation
socket(httpServer);

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

httpServer.listen(appConfig.port, () =>
  console.log(`Express server listening at http://localhost:${appConfig.port}`),
);
