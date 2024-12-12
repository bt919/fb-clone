import { type FastifyRequest, type FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "@/modules/user/user.repository";
import { PostRepository } from "@/modules/post/post.repository";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }

  interface FastifyInstance {
    db: PrismaClient;
    authRepository: AuthRepository;
    postRepository: PostRepository;
  }
}
