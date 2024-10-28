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
  describe("/sign-in", () => {
    it("returns status 200", async () => {
      const user = [
        {
          userId: "234234",
          email: "test1234@test.com",
          firstName: "bob",
          lastName: "test",
          hashedPassword:
            "$argon2id$v=19$m=19456,t=2,p=1$h5eVygnjTNz1kGbg6XpIQg$4AFD5kzN06ct5gtzO3R/RlA1+cqx1prJvUGEg42SZ4A",
          gender: "male",
          birthday: "1980-01-23",
        },
      ];
      prismaMock.$queryRawTyped.mockResolvedValue(user as any);

      const response = await server.inject({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        url: "/sign-in",
        body: {
          email: "test123@test.com",
          password: "bobtest123",
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it("returns user data alongside a jsonwebtoken", async () => {
      const user = [
        {
          userId: "234234",
          email: "test1234@test.com",
          firstName: "bob",
          lastName: "test",
          hashedPassword:
            "$argon2id$v=19$m=19456,t=2,p=1$h5eVygnjTNz1kGbg6XpIQg$4AFD5kzN06ct5gtzO3R/RlA1+cqx1prJvUGEg42SZ4A",
          gender: "male",
          birthday: "1980-01-23",
        },
      ];
      prismaMock.$queryRawTyped.mockResolvedValue(user as any);

      const response = await server.inject({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        url: "/sign-in",
        body: {
          email: "test123@test.com",
          password: "bobtest123",
        },
      });

      expect(JSON.parse(response.body)).toEqual({
        message: "success",
        data: {
          token: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          gender: expect.any(String),
        },
      });
    });
  });
});
