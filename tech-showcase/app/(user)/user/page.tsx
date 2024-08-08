"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import React from "react";
import UserAvatarComponent from "@/components/user-avatar";

const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card style={{ maxWidth: "666px", margin: "20px auto", padding: "20px" }}>
        <CardHeader>
          <CardTitle
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Logged In User Details 🙍🏻‍♂️
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1", minWidth: "200px" }}>
            <CardHeader style={{ marginBottom: "16px" }}>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </div>
          <div style={{ flexShrink: 0 }}>
            <UserAvatarComponent
              imageUrl=""
              name=""
              isLoading={true}
              size={150}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: "666px", margin: "20px auto", padding: "20px" }}>
      <CardHeader>
        <CardTitle
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          Logged In User Details 🙍🏻‍♂️
        </CardTitle>
      </CardHeader>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1", minWidth: "200px" }}>
          <CardHeader style={{ marginBottom: "16px" }}>
            <CardTitle style={{ fontSize: "18px", fontWeight: "bold" }}>
              Name:
            </CardTitle>
            <CardDescription style={{ fontSize: "16px" }}>
              {session?.user?.name}
            </CardDescription>
          </CardHeader>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px", fontWeight: "bold" }}>
              Email:
            </CardTitle>
            <CardDescription style={{ fontSize: "16px" }}>
              {session?.user?.email}
            </CardDescription>
          </CardHeader>
        </div>
        <div style={{ flexShrink: 0 }}>
          <UserAvatarComponent
            imageUrl={session?.user?.image}
            name={session?.user?.name}
            size={150}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
