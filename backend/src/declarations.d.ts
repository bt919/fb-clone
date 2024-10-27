import { type FastifyRequest, type FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "@/modules/auth/auth.repository";

declare module "fastify" {
  interface FastifyRequest {
    email: string;
  }

  interface FastifyInstance {
    db: PrismaClient;
    authRepository: AuthRepository;
  }
}
