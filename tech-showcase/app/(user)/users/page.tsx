"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/actions";

const Users = () => {
  const router = useRouter();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const handleCardClick = (id: string) => {
    router.push(`/users/${id}`);
  };

  if (isError) {
    return <div className="container mx-auto p-4">Error fetching photos.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="h-auto w-full p-4">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                    </div>
                    <div className="mb-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="mb-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="mb-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
          : users?.map((user) => (
              <Card
                key={user.id}
                className="h-auto w-full p-4 cursor-pointer"
                onClick={() => handleCardClick(user.id)}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <strong>Address:</strong>
                    <p>
                      {user.address.street}, {user.address.suite}
                    </p>
                    <p>
                      {user.address.city}, {user.address.zipcode}
                    </p>
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong>
                    <p>{user.phone}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Website:</strong>
                    <a
                      href={`http://${user.website}`}
                      className="text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  </div>
                  <div className="mb-2">
                    <strong>Company:</strong>
                    <p>{user.company.name}</p>
                    <p className="italic">{user.company.catchPhrase}</p>
                    <p>{user.company.bs}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Users;
