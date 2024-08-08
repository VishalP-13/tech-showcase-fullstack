"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { fetchPosts } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component from ShadCn
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => await fetchPosts(),
  });

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <p>Error loading posts.</p>
        <pre>{error instanceof Error ? error.message : "Unknown error"}</pre>
      </div>
    );
  }

  return (
    <section className="py-24">
      <div className="container">
        <div className="flex">
          <h1 className="mb-6 text-3xl font-bold">All Posts</h1>
          <Button
            variant={"outline"}
            className="mr-0 ml-auto"
            onClick={() => router.push("/posts/user")}
          >
            Register User
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="border p-4 rounded shadow"
                  data-testid="skeleton-item"
                >
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                </div>
              ))}
          </div>
        ) : (
          <DataTable columns={columns} data={posts || []} />
        )}
      </div>
    </section>
  );
};

export default Page;
