import Fastify, { FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import prisma from "@/shared/db/connection";
import { User, UserType } from "./auth.dto";

const fastify = Fastify();

fastify.post<{ Body: UserType; reply: UserType }>(
  "/sign-up",
  {
    schema: {
      body: User,
      response: {
        200: User,
      },
    },
  },
  async (request, reply) => {
    const { email, password } = request.body;
    reply.status(200).send({ email, password });
  },
);

export default fastify;
