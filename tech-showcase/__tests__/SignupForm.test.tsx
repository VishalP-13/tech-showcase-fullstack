import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "@/app/(auth)/signup/signup-form";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  // Add any other router methods you use
}));

{
  /**When you are writing unit tests for components that use Next.js routing (e.g., useRouter for navigation), you often want to isolate the component from its dependencies. This means you don't want to perform actual navigation during tests. By mocking useRouter, you can:

Control the behavior of the push method (e.g., checking if it's called when a form is submitted).
Ensure that tests do not depend on the actual implementation of the Next.js router.
Prevent actual page navigation, which would be unnecessary and potentially disruptive in a test environment. */
}

describe("SignupForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });
  test("It renders 3 input fields on the screen", () => {
    render(<SignupForm />);

    const inputFields = screen.getAllByRole("textbox");
    const passwordField = screen.getByLabelText(/password/i); // getByLabelText  is used to fetch the password input field since password fields do not have the "textbox" role.

    expect(inputFields).toHaveLength(2); // Name and email fields
    expect(passwordField).toBeInTheDocument(); // Password field
  });

  test("Displays validation errors on invalid input", async () => {
    render(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters long/i),
      ).toBeInTheDocument();
    });
  }); 

  test("Submits the form with valid input", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Success" }, //will show this message once api gets success or promise resolved
    });

    render(<SignupForm />);

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

  test("Displays error message on form submission failure", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Sign up failed" } }, //will show this message once api fails or promise rejected
    });

    render(<SignupForm />);

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

  //   test("Disables inputs and button when form is submitting", async () => {
  //     render(<SignupForm />);

  //     fireEvent.input(screen.getByPlaceholderText(/name/i), {
  //       target: { value: "John Doe" },
  //     });
  //     fireEvent.input(screen.getByPlaceholderText(/email/i), {
  //       target: { value: "john.doe@example.com" },
  //     });
  //     fireEvent.input(screen.getByPlaceholderText(/password/i), {
  //       target: { value: "password123" },
  //     });

  //     fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  //     expect(screen.getByPlaceholderText(/name/i)).toBeDisabled();
  //     expect(screen.getByPlaceholderText(/email/i)).toBeDisabled();
  //     expect(screen.getByPlaceholderText(/password/i)).toBeDisabled();
  //     expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();

  //     await waitFor(() => {
  //       expect(screen.getByPlaceholderText(/name/i)).not.toBeDisabled();
  //       expect(screen.getByPlaceholderText(/email/i)).not.toBeDisabled();
  //       expect(screen.getByPlaceholderText(/password/i)).not.toBeDisabled();
  //       expect(screen.getByRole("button", { name: /sign up/i })).not.toBeDisabled();
  //     });
  //   });
});
