import { FastifyInstance } from "fastify";
import {
  User,
  UserCredentials,
  UserCredentialsType,
  UserType,
} from "./user.dto";
import { signUp, signIn } from "./user.service";

export default function (fastify: FastifyInstance, opts, done) {
  fastify.post<{ Body: UserType }>(
    "/sign-up",
    { schema: { body: User } },
    async function (request, reply) {
      await signUp(request.body, this.authRepository);

      return reply.status(201).send({ message: "success" });
    },
  );

  fastify.post<{ Body: UserCredentialsType }>(
    "/sign-in",
    { schema: { body: UserCredentials } },
    async function (request, reply) {
      const userData = await signIn(request.body, this.authRepository);

      return reply.status(200).send({ message: "success", data: userData });
    },
  );

  done();
}
