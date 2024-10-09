import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import path from "node:path";
import authRouter from "@/modules/auth/auth.router";
import { verifyJWT } from "@/shared/jwt/verify-jwt";

export default async function createServer(fastify: FastifyInstance) {
  await fastify.register(helmet, {});

  await fastify.register(cors, {
    origin: "*",
    methods: "*",
  });

  fastify.setErrorHandler(async function (error, request, reply) {
    this.log.error(error);

    return reply.status(error.statusCode || 500).send();
  });

  await fastify.register(authRouter);

  fastify.register((fastify: FastifyInstance, opts, done) => {
    fastify.addHook("preParsing", async (request) => {
      request.email = "";
      await verifyJWT(request);
    });
    // all routes that need auth go in here
    done();
  });

  // fastify.addHook("preParsing", async (request) => {
  //   await verifyJWT(request);
  // });

  return fastify.withTypeProvider<TypeBoxTypeProvider>();
}
