import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import path from "node:path";
import authRouter from "@/modules/user/user.router";
import { verifyJWT } from "@/shared/jwt/verify-jwt";
import db from "@/shared/db/connection";
import { AuthRepository } from "@/modules/user/user.repository";
import { getPresignedPutUrl } from "@/shared/aws-utils/cloudfront-sign";

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

  // fastify.decorate("db", db);

  // a temporary route just to test out pre-signed urls (it works)
  fastify.post("/", async function (request, reply) {
    const signedUrl = getPresignedPutUrl({
      s3ObjectKey: "index.html",
      expiresIn: 60,
    });

    return reply.status(200).send({ signedUrl });
  });

  await fastify.register((fastify: FastifyInstance, opts, done) => {
    fastify.decorate("authRepository", new AuthRepository(db));
    fastify.register(authRouter, { prefix: "/user" });
    done();
  });

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
