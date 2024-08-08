import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/app/(auth)/login/login-form";
import { signIn } from "next-auth/react";

jest.mock("next-auth/react");

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields and buttons", async () => {
    render(<LoginForm />);

    await waitFor(() => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    })
  }); 

  test("displays validation errors on invalid input", async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters long/i),
      ).toBeInTheDocument();
    });
  });

  test("submits the form with valid input", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({});

    render(<LoginForm />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "john.doe@example.com",
        password: "password123",
        redirect: true,
      },
      { callbackUrl: "http://localhost:3000" });
    });
  });

  test("displays error message on sign-in failure", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    render(<LoginForm />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });


  test("handles social sign-in button clicks", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({});

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /google/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "http://localhost:3000",
      });
    });

    fireEvent.click(screen.getByRole("button", { name: /github/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("github", {
        callbackUrl: "http://localhost:3000",
      });
    });
  });
});
