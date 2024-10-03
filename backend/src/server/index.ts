import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export default async function createServer(fastify: FastifyInstance) {
  await fastify.register(helmet, {});

  await fastify.register(cors, {});

  return fastify.withTypeProvider<TypeBoxTypeProvider>();
}
