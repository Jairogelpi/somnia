import Fastify from "fastify";

export function buildServer() {
  const app = Fastify({ logger: true });
  app.get("/health", async () => ({ ok: true, service: "somnia-backend" }));
  return app;
}

// Solo ejecutar si es el archivo principal
const isMainModule = process.argv[1] && process.argv[1].endsWith('server.ts');
if (isMainModule) {
  const app = buildServer();
  app.listen({ port: 8000, host: "0.0.0.0" }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
}
