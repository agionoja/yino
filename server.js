import { createServer } from "node:http";
import "dotenv/config.js";
import crone from "node-cron";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import socket from "./socket/socket.js";
import appConfig from "./app.config.js";
import db from "./db.js";

crone.schedule("5 * * * *", async () => {
  try {
    const formData = new FormData();
    formData.append("_action", "default-login");
    formData.append("name", process.env.CRONE_SPINNER_USERNAME);
    formData.append("password", process.env.CRONE_SPINNER_PASSWORD);

    const res = await fetch("https://yino.onrender.com/auth/login", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log({ statusText: res.statusText });
  } catch (err) {
    console.error(`There was an error spinning the server: ${err}`);
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

(async () => {
  await db.connect({ maxRetries: 5, localDb: true, forceLocal: true });

  httpServer.listen(appConfig.port, () => {
    console.log(
      `Express server listening at http://localhost:${appConfig.port}`,
    );
  });
})();
