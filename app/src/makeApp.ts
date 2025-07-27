import path from "node:path";
import fastifyAutoload from "@fastify/autoload";
import fastify from "fastify";
import ttsRoutes from "./routes/ttsRoutes.js";

export function makeApp() {
  const app = fastify({
    logger: true,
    disableRequestLogging: true,
  });

  app.register(fastifyAutoload, {
    dir: path.resolve("./dist/plugins"),
  });

  app.register(ttsRoutes);

  app.get("/healthz", async () => {
    return {
      ok: true,
    };
  });

  return app;
}
