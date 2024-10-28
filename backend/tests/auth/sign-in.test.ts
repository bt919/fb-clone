import server from "../setup/server";
import authRouter from "@/modules/auth/auth.router";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { prismaMock } from "../setup/singleton";
import { FastifyInstance } from "fastify";
import { gender_type } from "@prisma/client";

beforeAll(async () => {
  const user = {
    public_id: "123",
    email: "test123@test.com",
    hashed_password: "bobtest123",
    first_name: "bob",
    last_name: "test",
    gender: "male" as gender_type,
    birthday: "1980-02-13" as unknown as Date,
    id: 23,
  };
  prismaMock.users.create.mockResolvedValue(user);
  prismaMock.$queryRaw.mockResolvedValue({});
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
  describe("/sign-in", () => {
    it("returns status 200", async () => {
      // const user = {
      //   public_id: "123",
      //   email: "test123@test.com",
      //   hashed_password: "bobtest123",
      //   first_name: "bob",
      //   last_name: "test",
      //   gender: "male" as gender_type,
      //   birthday: "1980-02-13" as unknown as Date,
      //   id: 23,
      // };
      // prismaMock.users.create.mockResolvedValue(user);
      // prismaMock.$queryRaw.mockResolvedValue({});

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
      // const user = {
      //   public_id: "123",
      //   email: "test123@test.com",
      //   hashed_password: "bobtest123",
      //   first_name: "bob",
      //   last_name: "test",
      //   gender: "male" as gender_type,
      //   birthday: "1980-02-13" as unknown as Date,
      //   id: 23,
      // };
      // prismaMock.users.create.mockResolvedValue(user);
      // prismaMock.$queryRaw.mockResolvedValue({});

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
