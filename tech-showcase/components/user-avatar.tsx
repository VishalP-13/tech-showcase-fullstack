import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UserAvatarComponentProps {
  imageUrl: string | null | undefined;
  name: string | null | undefined;
  isLoading?: boolean;
  size: number;
}

const UserAvatarComponent = ({
  imageUrl,
  name,
  isLoading,
  size = 150,
}: UserAvatarComponentProps) => {
  return (
    <Avatar
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: "1.5px solid #ccc",
        borderRadius: "50%",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <Skeleton className={`h-${size / 4} w-${size / 4} rounded-full`} />
      ) : (
        <>
          <AvatarImage
            src={imageUrl ?? "/user-image.png"}
            alt="User profile image"
          />
          <AvatarFallback>{name ? name.split(" ")[0] : "User"}</AvatarFallback>
        </>
      )}
    </Avatar>
  );
};

export default UserAvatarComponent;
