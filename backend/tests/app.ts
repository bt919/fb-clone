import Fastify from "fastify";
import createServer from "../src/server/server";

const fastify = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.get("/", async function (request, reply) {
  return { hello: "world" };
});

createServer(fastify);

export default fastify;
