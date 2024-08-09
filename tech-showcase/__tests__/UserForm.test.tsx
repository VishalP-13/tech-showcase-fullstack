import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { UserForm } from "@/components/user-form";

jest.mock("axios");
jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("UserForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("renders form fields and buttons correctly for each mode", async () => {
    // Test for signup mode
    render(<UserForm mode="signup" />);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
    cleanup();

    // Test for register mode
    render(<UserForm mode="register" />);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
    cleanup();

    // Test for login mode
    render(<UserForm mode="login" />);
    expect(screen.queryByPlaceholderText(/name/i)).toBeNull();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
  });

  test("displays validation errors on invalid input", async () => {
    render(<UserForm mode="signup" />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters long/i),
      ).toBeInTheDocument();
    });
  });

  test("submits the form with valid input in signup mode", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Success" },
    });

    render(<UserForm mode="signup" />);

    fireEvent.input(screen.getByPlaceholderText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/");
      expect(screen.queryByText(/something went wrong/i)).toBeNull();
    });
  });

  test("displays error message on form submission failure in signup mode", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Sign up failed" } },
    });

    render(<UserForm mode="signup" />);

    fireEvent.input(screen.getByPlaceholderText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/sign up failed/i)).toBeInTheDocument();
    });
  });

  test("submits the form with valid input in login mode", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({});

    render(<UserForm mode="login" />);

    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        {
          email: "john.doe@example.com",
          password: "password123",
          redirect: true,
        },
        { callbackUrl: "http://localhost:3000" },
      );
    });
  });

  test("displays error message on sign-in failure", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    render(<UserForm mode="login" />);

    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("handles social sign-in button clicks", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({});

    render(<UserForm mode="login" />);

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

  test("submits the form with valid input in register mode", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Success" },
    });

    render(<UserForm mode="register" />);

    fireEvent.input(screen.getByPlaceholderText(/name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.queryByText(/something went wrong/i)).toBeNull();
    });
  });

  test("displays error message on form submission failure in register mode", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Register failed" } },
    });

    render(<UserForm mode="register" />);

    fireEvent.input(screen.getByPlaceholderText(/name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/register failed/i)).toBeInTheDocument();
    });
  });
});
