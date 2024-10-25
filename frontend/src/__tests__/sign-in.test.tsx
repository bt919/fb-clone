import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeAll,
  describe,
  expect,
  it,
  afterEach,
  afterAll,
  beforeEach,
} from "vitest";
import { RouterProvider } from "@tanstack/react-router";

import SignIn from "@/src/components/sign-in";
import { wrapper } from "./index";

const server = setupServer(
  http.post("/sign-in", () => {
    return HttpResponse.json(
      { message: "success" },
      {
        status: 200,
      },
    );
  }),
);

beforeAll(() => {
  server.listen();

  userEvent.setup();
});
beforeEach(() => {
  const router: any = wrapper(<SignIn />);
  render(<RouterProvider router={router} />);
});
afterEach(() => {
  server.resetHandlers();

  cleanup();
});
afterAll(() => {
  server.close();
});

describe("Sign in component", () => {
  it("contains the appropriate form fields", () => {
    const emailAddressInput = screen.getByPlaceholderText(
      "Email address or phone number",
    );
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(emailAddressInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it("does not show form errors before 'Log in' button is clicked", () => {
    const emailError = screen.queryByText(
      "Invalid email (example: user@example.com",
    );
    const passwordError = screen.queryByText(
      "Must be between 8 and 64 characters",
    );

    expect(emailError).toBeNull();
    expect(passwordError).toBeNull();
  });

  it("shows form errors when 'Log in' button is clicked", async () => {
    await userEvent.click(screen.getByText("Log in"));

    expect(
      screen.queryByText("Invalid email (example: user@example.com)"),
    ).not.toBeNull();
    expect(
      screen.queryByText("Must be between 8 and 64 characters"),
    ).not.toBeNull();
  });

  it("lets you successfully log in", async () => {
    const emailAddressInput: HTMLInputElement = screen.getByPlaceholderText(
      "Email address or phone number",
    );
    fireEvent.change(emailAddressInput, { target: { value: "bob@test.com" } });
    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "bobtest12" } });

    await userEvent.click(screen.getByText("Log in"));

    expect(screen.queryByText("Email or password incorrect.")).toBeNull();
    expect(screen.queryByText("Unexpected error. Try again later.")).toBeNull();
    expect(
      screen.queryByText("Invalid email (example: user@example.com)"),
    ).toBeNull();
    expect(
      screen.queryByText("Must be between 8 and 64 characters"),
    ).toBeNull();
  });

  it("shows error message when you log in using wrong password", async () => {
    server.use(
      http.post<{}, { email: string; password: string }, {}>(
        "/sign-in",
        async ({ request }) => {
          const body = await request.json();
          const email = "bob@test.com";
          const password = "bobtest123";

          if (email !== body.email || password !== body.password) {
            return HttpResponse.json(null, {
              status: 401,
            });
          }

          return HttpResponse.json(
            { message: "success" },
            {
              status: 200,
            },
          );
        },
      ),
    );
    const emailAddressInput: HTMLInputElement = screen.getByPlaceholderText(
      "Email address or phone number",
    );
    fireEvent.change(emailAddressInput, { target: { value: "bob@test.com" } });
    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "bobtest12" } });

    await userEvent.click(screen.getByText("Log in"));

    expect(screen.queryByText("Email or password incorrect.")).not.toBeNull();
  });

  it("shows error message when the server has an unexpected error", async () => {
    server.use(
      http.post("/sign-in", () => {
        return HttpResponse.json(null, {
          status: 500,
        });
      }),
    );
    const emailAddressInput: HTMLInputElement = screen.getByPlaceholderText(
      "Email address or phone number",
    );
    fireEvent.change(emailAddressInput, { target: { value: "bob@test.com" } });
    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "bobtest123" } });

    await userEvent.click(screen.getByText("Log in"));

    expect(
      screen.queryByText("Unexpected error. Try again later."),
    ).not.toBeNull();
  });
});
