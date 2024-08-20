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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("axios");
jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const queryClient = new QueryClient();

describe("UserForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    queryClient.clear();
  });

  afterEach(cleanup);

  const renderComponent = (mode: "signup" | "register" | "login") =>
    render(
      <QueryClientProvider client={queryClient}>
        <UserForm mode={mode} />
      </QueryClientProvider>,
    );

  it("renders the form fields correctly", () => {
    renderComponent("signup");

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("handles signup submission", async () => {
    const mockResponse = { data: { message: "User registered successfully" } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    renderComponent("signup");

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith("/"));
  });

  it("handles register submission", async () => {
    const mockResponse = {
      data: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    renderComponent("register");

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() =>
      expect(
        screen.getByText("User Registered Successfully ✅"),
      ).toBeInTheDocument(),
    );
  });

  it("handles login submission", async () => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    (signIn as jest.Mock).mockImplementation(mockSignIn);

    renderComponent("login");

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "john@example.com",
        password: "password123",
        redirect: true,
        callbackUrl: "http://localhost:3000",
      }),
    );
  });

  it("handles social login", async () => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    (signIn as jest.Mock).mockImplementation(mockSignIn);

    renderComponent("login");

    fireEvent.click(screen.getByText("Google"));

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith("google", {
        callbackUrl: "http://localhost:3000",
      }),
    );
  });

  it("displays errors correctly", async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Something went wrong" } },
    });

    renderComponent("signup");

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() =>
      expect(screen.getByText("Something went wrong")).toBeInTheDocument(),
    );
  });
});
