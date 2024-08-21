import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";
import UserForm from "@/components/user-form";

const ResetPasswordPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to send reset link to your email
            </p>
          </div>
          <UserForm mode="resetPassword" />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
