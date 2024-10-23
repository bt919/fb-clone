import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, afterEach, afterAll } from "vitest";
import { RouterProvider } from "@tanstack/react-router";

import SignUp from "@/src/components/sign-up";
import { wrapper } from "./index";

const server = setupServer(
  http.post("/sign-up", () => {
    return HttpResponse.json(
      { message: "success" },
      {
        status: 201,
      },
    );
  }),
);

beforeAll(() => {
  server.listen();

  userEvent.setup();

  const router: any = wrapper(<SignUp />);
  render(<RouterProvider router={router} />);
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  cleanup();
});

describe("Sign up component", async () => {
  it("contains the appropriate form fields", () => {
    const firstNameInput = screen.getByPlaceholderText("First name");
    const surnameInput = screen.getByPlaceholderText("Surname");
    const femaleGenderLabel = screen.getByLabelText("Female");
    const maleGenderLabel = screen.getByLabelText("Male");
    const otherGenderLabel = screen.getByLabelText("Other");
    const emailAddressInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("New password");

    expect(firstNameInput).toBeDefined();
    expect(surnameInput).toBeDefined();
    expect(femaleGenderLabel).toBeDefined();
    expect(maleGenderLabel).toBeDefined();
    expect(otherGenderLabel).toBeDefined();
    expect(emailAddressInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it("does not show form errors before 'sign up' button is clicked", () => {
    const nameErrors = screen.queryAllByText("Cannot be empty.");
    const genderError = screen.queryByText("This field is required.");
    const emailError = screen.queryByText("Invalid email", { exact: false });
    const passwordError = screen.queryByText(
      "Must be between 8 and 64 characters.",
    );

    expect(nameErrors).toHaveLength(0);
    expect(genderError).toBeNull();
    expect(emailError).toBeNull();
    expect(passwordError).toBeNull();
  });

  it("shows form errors when 'sign up' button is clicked", async () => {
    await userEvent.click(screen.getByText("Sign Up"));

    const nameErrors = screen.queryAllByText("Cannot be empty.");
    const genderError = screen.queryByText("This field is required.");
    const emailError = screen.queryByText("Invalid email", { exact: false });
    const passwordError = screen.queryByText(
      "Must be between 8 and 64 characters.",
    );

    expect(nameErrors).toHaveLength(2);
    expect(genderError).toBeDefined();
    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
  });

  it("lets you successfully sign up", async () => {
    const firstNameInput: HTMLInputElement =
      screen.getByPlaceholderText("First name");
    fireEvent.change(firstNameInput, { target: { value: "bob" } });
    const lastNameInput: HTMLInputElement =
      screen.getByPlaceholderText("Surname");
    fireEvent.change(lastNameInput, { target: { value: "lee" } });
    const femaleGenderLabel = screen.getByLabelText("Female");
    fireEvent.click(femaleGenderLabel);
    const emailAddressInput = screen.getByPlaceholderText("Email address");
    fireEvent.change(emailAddressInput, {
      target: { value: "bob@example.com" },
    });
    const passwordInput = screen.getByPlaceholderText("New password");
    fireEvent.change(passwordInput, { target: { value: "bobtest123" } });

    await userEvent.click(screen.getByText("Sign Up"));

    expect(
      screen.queryByText("An account with this email already exists."),
    ).toBeNull();
    expect(
      screen.queryByText("Unexpected error. Please try again later."),
    ).toBeNull();
    expect(screen.queryByText("Cannot be empty>")).toBeNull();
    expect(screen.queryByText("This field is required.")).toBeNull();
    expect(
      screen.queryByText("Invalid email (example: user@example.com)"),
    ).toBeNull();
    expect(
      screen.queryByText("Must be between 8 and 64 characters."),
    ).toBeNull();
  });

  it("shows error message when you try to register with an existing email", async () => {
    server.use(
      http.post<{}, { email: string }, {}>("/sign-up", async ({ request }) => {
        const body = await request.json();

        if (body.email === "bob@test.com") {
          return HttpResponse.json(
            { message: "An account with this email already exists." },
            {
              status: 400,
            },
          );
        }

        return HttpResponse.json(
          { message: "success" },
          {
            status: 201,
          },
        );
      }),
    );
    const firstNameInput: HTMLInputElement =
      screen.getByPlaceholderText("First name");
    fireEvent.change(firstNameInput, { target: { value: "bob" } });
    const lastNameInput: HTMLInputElement =
      screen.getByPlaceholderText("Surname");
    fireEvent.change(lastNameInput, { target: { value: "lee" } });
    const femaleGenderLabel = screen.getByLabelText("Female");
    fireEvent.click(femaleGenderLabel);
    const emailAddressInput = screen.getByPlaceholderText("Email address");
    fireEvent.change(emailAddressInput, {
      target: { value: "bob@test.com" },
    });
    const passwordInput = screen.getByPlaceholderText("New password");
    fireEvent.change(passwordInput, { target: { value: "bobtest123" } });

    await userEvent.click(screen.getByText("Sign Up"));

    expect(
      screen.getByText("An account with this email already exists."),
    ).toBeDefined();
  });

  it("shows error message when the server has an unexpected error", async () => {
    server.use(
      http.post("/sign-up", () => {
        return HttpResponse.json(null, {
          status: 500,
        });
      }),
    );
    const firstNameInput: HTMLInputElement =
      screen.getByPlaceholderText("First name");
    fireEvent.change(firstNameInput, { target: { value: "bob" } });
    const lastNameInput: HTMLInputElement =
      screen.getByPlaceholderText("Surname");
    fireEvent.change(lastNameInput, { target: { value: "lee" } });
    const femaleGenderLabel = screen.getByLabelText("Female");
    fireEvent.click(femaleGenderLabel);
    const emailAddressInput = screen.getByPlaceholderText("Email address");
    fireEvent.change(emailAddressInput, {
      target: { value: "bob@test.com" },
    });
    const passwordInput = screen.getByPlaceholderText("New password");
    fireEvent.change(passwordInput, { target: { value: "bobtest123" } });

    await userEvent.click(screen.getByText("Sign Up"));

    expect(
      screen.getByText("Unexpected error. Please try again later."),
    ).toBeDefined();
  });
});
