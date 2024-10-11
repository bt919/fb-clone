import app from "./app";

describe("this is a temporary test to verify whether we can test our endopints", () => {
  test("endpoint returns 200", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
  });
});
