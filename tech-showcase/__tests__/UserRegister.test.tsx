import React from "react";
import axios from "axios";
import { UserRegisterForm } from "@/app/posts/user/user-register-form";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("axios");

describe("UserRegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("It renders 3 input fields on the screen", () => {
    render(<UserRegisterForm />);

    const inputFields = screen.getAllByRole("textbox");
    const passwordField = screen.getByLabelText(/password/i); // getByLabelText  is used to fetch the password input field since password fields do not have the "textbox" role.

    expect(inputFields).toHaveLength(2); // Name and email fields
    expect(passwordField).toBeInTheDocument(); // Password field
  });

  test("Displays validation errors on invalid input", async () => {
    render(<UserRegisterForm />);

    const submitButton = screen.getByRole("button", { name: /register/i });

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

    render(<UserRegisterForm />);

    fireEvent.input(screen.getByPlaceholderText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.queryByText(/something went wrong/i)).toBeNull();
    });
  });

  test("Displays error message on form submission failure", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "User registration failed" } }, //will show this message once api fails or promise rejected
    });

    render(<UserRegisterForm />);
 
    fireEvent.input(screen.getByPlaceholderText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/user registration failed/i)).toBeInTheDocument();
    });
  });
});
