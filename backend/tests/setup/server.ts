import Fastify from "fastify";
import createServer from "@/server/server";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const fastify = Fastify({
  //   logger: false,
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

// createServer(fastify);

export default fastify.withTypeProvider<TypeBoxTypeProvider>();
