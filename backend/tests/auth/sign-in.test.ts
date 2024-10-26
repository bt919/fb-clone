import app from "../app";

describe("Auth service", () => {
  describe("/sign-in", () => {
    it("returns status 200", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/sign-in",
        body: {
          email: "test123@test.com",
          password: "bobtest123",
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it("returns user data alongside a jsonwebtoken", async () => {
      const response = await app.inject({
        method: "POST",
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
