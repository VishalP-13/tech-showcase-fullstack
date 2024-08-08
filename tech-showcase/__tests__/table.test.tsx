import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import Page from "@/app/posts/page"; // Adjust this import path as needed

jest.mock("axios");

describe("Posts Table", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  test("It renders the table with correct headers", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
      status: 200,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("All Posts")).toBeInTheDocument();
      expect(screen.getByText("Id")).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
    });
  });

  test("It displays loading state initially", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
      status: 200,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );

    expect(screen.getByText("All Posts")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-item")).toHaveLength(5);
  });

  test("It displays posts data after successful fetch", async () => {
    const mockPosts = [
      { id: 1, title: "Test Post 1", body: "This is test post 1" },
      { id: 2, title: "Test Post 2", body: "This is test post 2" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockPosts,
      status: 200,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });
  });

  test("It displays error message on fetch failure", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch"),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading posts.")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });
  });

  test("It filters posts by title", async () => {
    const mockPosts = [
      { id: 1, title: "Test Post 1", body: "This is test post 1" },
      { id: 2, title: "Test Post 2", body: "This is test post 2" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockPosts,
      status: 200,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText("Filter Title...");
    fireEvent.change(filterInput, { target: { value: "Test Post 1" } });

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Post 2")).not.toBeInTheDocument();
    });
  });

  // test("It toggles column visibility", async () => {
  //   const mockPosts = [
  //     { id: 1, title: "Test Post 1", body: "This is test post 1" },
  //   ];

  //   (axios.get as jest.Mock).mockResolvedValueOnce({
  //     data: mockPosts,
  //     status: 200,
  //   });

  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Page />
  //     </QueryClientProvider>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText("Test Post 1")).toBeInTheDocument();
  //   });

  //   const columnsButton = screen.getByText("Columns");
  //   fireEvent.click(columnsButton);

  //   // Wait for the dropdown to open
  //   // await waitFor(() => {
  //   //   expect(screen.getByTestId("columns-dropdown")).toBeInTheDocument();
  //   // });

  //   const bodyCheckbox = screen.getByRole("menuitemcheckbox", { name: /body/i });
  //   fireEvent.click(bodyCheckbox);

  //   // await waitFor(() => {
  //   //   expect(screen.queryByText("This is test post 1")).not.toBeInTheDocument();
  //   // });
  // });
});
