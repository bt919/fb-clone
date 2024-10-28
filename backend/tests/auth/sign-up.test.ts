import server from "../setup/server";
import authRouter from "@/modules/auth/auth.router";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { prismaMock } from "../setup/singleton";
import { FastifyInstance } from "fastify";
import { gender_type } from "@prisma/client";

beforeAll(async () => {
  server.decorate("db", prismaMock);
  await server.register((fastify: FastifyInstance, opts, done) => {
    fastify.decorate("authRepository", new AuthRepository(fastify.db));
    fastify.register(authRouter);
    done();
  });

  await server.listen();
});
afterAll(async () => {
  await server.close();
});

describe("Auth service", () => {
  describe("/sign-up", () => {
    it("returns status 400", async () => {
      const user = {
        id: 123,
        public_id: "234",
        email: "bob@test.com",
        hashed_password: "asdlfkj1234",
        first_name: "bob",
        last_name: "test",
        gender: "male" as unknown as gender_type,
        birthday: "1990-01-23" as unknown as Date,
      };
      prismaMock.users.create.mockResolvedValue(user);
      prismaMock.$queryRaw.mockResolvedValue([
        {
          email: "bob@test.com",
          hashedPassword: "asdlfkjaldkfj",
          userId: "1234",
          firstName: "bob",
          lastName: "test",
          gender: "male",
        },
      ]);

      const response = await server.inject({
        method: "POST",
        url: "/sign-up",
        body: {
          email: "test234@test.com",
          password: "bobtest123",
          firstName: "test",
          lastName: "bob",
          gender: "male",
          birthday: "1980-03-24",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
