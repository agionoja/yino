import { createServer } from "node:http";
import "dotenv/config.js";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import socket from "./socket/socket.js";
import appConfig from "./app.config.js";
import db from "./db.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: appConfig.nodeEnv === "production" ? 500 : 10000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
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

app.use(limiter);
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
  await db.connect({ maxRetries: 3, localDb: false, forceLocal: true });

  httpServer.listen(appConfig.port, () => {
    console.log(
      `Express server listening at http://localhost:${appConfig.port}`,
    );
  });
})();
