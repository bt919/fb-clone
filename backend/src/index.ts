import Fastify from "fastify";
import server from "./server/server";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server is listening at address ${address}`);
});

async function init() {
  const fastify = Fastify({
    logger: true,
  });

  await server(fastify);
}

init();
