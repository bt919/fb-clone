import app from "../app";
import db from "@/shared/db/connection";

describe("Auth service", () => {
  describe("/sign-up", () => {
    it("returns status 400", async () => {
      const response = await app.inject({
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
  });
});
