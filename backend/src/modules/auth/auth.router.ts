import { FastifyInstance } from "fastify";
import {
  User,
  UserCredentials,
  UserCredentialsType,
  UserType,
} from "./auth.dto";
import { signUp, signIn } from "./auth.service";
import { AuthRepository } from "./auth.repository";

export default function (fastify: FastifyInstance, opts, done) {
  fastify.post<{ Body: UserType }>("/sign-up", async function (request, reply) {
    const success = await signUp(request.body, new AuthRepository());
    console.log(success);

    return reply.status(201).send({ message: "success" });
  });

  fastify.post<{ Body: UserCredentialsType }>(
    "/sign-in",
    async (request, reply) => {
      const token = await signIn(request.body, new AuthRepository());

      return reply.status(200).send({ token });
    },
  );

  done();
}
