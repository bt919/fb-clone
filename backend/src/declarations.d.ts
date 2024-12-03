import { type FastifyRequest, type FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "@/modules/user/user.repository";

declare module "fastify" {
  interface FastifyRequest {
    email: string;
  }

  interface FastifyInstance {
    db: PrismaClient;
    authRepository: AuthRepository;
  }
}
