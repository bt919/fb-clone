import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export default async function createServer(fastify: FastifyInstance) {
  await fastify.register(helmet, {});

  await fastify.register(cors, {});

  fastify.addHook("onError", async (request, reply, error) => {
    fastify.log.error(error);

    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({ message: error.message });
  });

  return fastify.withTypeProvider<TypeBoxTypeProvider>();
}
