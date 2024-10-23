import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "global-jsdom/register";
import { beforeAll, describe, expect, it } from "vitest";
import { RouterProvider } from "@tanstack/react-router";

import SignIn from "@/src/components/sign-in";
import { wrapper } from "./index";

describe("just a test", async () => {
  it("renders correctly", () => {
    const router: any = wrapper(<SignIn />);
    render(<RouterProvider router={router} />);

    // expect(screen.getByText("Create a new account")).toBeDefined;
    screen.debug();
  });
});
