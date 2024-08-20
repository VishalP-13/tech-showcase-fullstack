import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Page from "@/app/posts/page";
import { fetchPosts } from "@/lib/actions";
import { columns } from "@/app/posts/columns";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";

jest.mock("../lib/actions", () => ({
  fetchPosts: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../components/data-table", () => ({
  DataTable: jest.fn(() => <div data-testid="data-table"></div>),
}));

const queryClient = new QueryClient();

const renderPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );

describe("Posts Page Integration Tests", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    queryClient.clear();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays skeleton loaders while data is loading", async () => {
    (fetchPosts as jest.Mock).mockResolvedValueOnce([]);

    renderPage();

    expect(screen.getAllByTestId("skeleton-item").length).toBe(5);

    await waitFor(() => {
      expect(screen.queryByTestId("skeleton-item")).toBeNull();
    });
  });

  it("renders data in the table after fetching posts", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", content: "Content 1" },
      { id: 2, title: "Post 2", content: "Content 2" },
    ];

    (fetchPosts as jest.Mock).mockResolvedValueOnce(mockPosts);

    renderPage();

    await waitFor(() => {
      expect(screen.queryByTestId("skeleton-item")).toBeNull();
    });

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns,
        data: mockPosts,
      }),
      expect.anything()
    );
  });

  it("fetches the next page of posts when the 'Next' button is clicked", async () => {
    const mockPostsPage1 = [
      { id: 1, title: "Post 1", content: "Content 1" },
      { id: 2, title: "Post 2", content: "Content 2" },
    ];

    const mockPostsPage2 = [
      { id: 3, title: "Post 3", content: "Content 3" },
      { id: 4, title: "Post 4", content: "Content 4" },
    ];

    (fetchPosts as jest.Mock)
      .mockResolvedValueOnce(mockPostsPage1)
      .mockResolvedValueOnce(mockPostsPage2);

    renderPage();

    await waitFor(() => {
      expect(screen.queryByTestId("skeleton-item")).toBeNull();
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.queryByTestId("skeleton-item")).toBeNull();
    });

    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        columns,
        data: mockPostsPage2,
      }),
      expect.anything()
    );
  });
});
