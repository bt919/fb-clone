import server from "../setup/server";
import authRouter from "@/modules/auth/auth.router";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { prismaMock } from "../setup/singleton";
import { FastifyInstance } from "fastify";
import { gender_type } from "@prisma/client";

beforeAll(async () => {
  server.decorate("db", prismaMock);
  await server.register((fastify: FastifyInstance, opts, done) => {
    fastify.decorate("authRepository", new AuthRepository(prismaMock));
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
    it("allows you to sign up successfully", async () => {
      prismaMock.$queryRawTyped.mockResolvedValue([]);
      const createdUser = {
        email: "test234@test.com",
      };
      prismaMock.users.create.mockResolvedValue(createdUser as any);

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

      expect(response.statusCode).toBe(201);
    });

    it("disallows signup if a field is missing", async () => {
      prismaMock.$queryRawTyped.mockResolvedValue([]);
      const createdUser = {
        email: "test234@test.com",
      };
      prismaMock.users.create.mockResolvedValue(createdUser as any);

      const response = await server.inject({
        method: "POST",
        url: "/sign-up",
        body: {
          email: "test234@test.com",
          password: "bobtest123",
          firstName: "test",
          lastName: "bob",
          gender: "male",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("disallow signup if an account with that email already exists", async () => {
      prismaMock.$queryRawTyped.mockResolvedValue([{}]);

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
