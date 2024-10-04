import Fastify from "fastify";
import { Type } from "@sinclair/typebox";

const fastify = Fastify();

fastify.route({
  method: "POST",
  url: "/sign-up",
  schema: {
    body: Type.Object({
      email: Type.String({ format: "email" }),
      password: Type.String({
        minLength: 8,
        maxLength: 64,
      }),
    }),
  },
  handler: function (request, reply) {},
});

export default fastify;
