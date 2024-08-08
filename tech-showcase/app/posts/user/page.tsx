import React from "react";
import { UserForm } from "@/components/user-form";

export default async function UserRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Register User
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to register your user
            </p>
          </div>
          <UserForm mode="register" />;
        </div>
      </div>
    </div>
  );
}
