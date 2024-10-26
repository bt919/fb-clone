import Fastify from "fastify";
import createServer from "../src/server/server";

const fastify = Fastify({
  logger: false,
  // logger: {
  //   level: "info",
  //   transport: {
  //     target: "pino-pretty",
  //   },
  // },
});

createServer(fastify);

export default fastify;
