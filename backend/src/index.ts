import Fastify from "fastify";
import server from "./server/server";

async function init() {
  const fastify = Fastify({
    logger: true,
  });

  await server(fastify);
}

init();
