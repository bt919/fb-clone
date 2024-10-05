import Fastify from "fastify";
import server from "./server/server";
import { serverConfig } from "./config/server.config";

async function init() {
  const fastify = Fastify({
    logger: true,
  });

  await server(fastify);

  try {
    await fastify.listen({ port: serverConfig.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

init();
