import { type FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    email: string;
  }
}
