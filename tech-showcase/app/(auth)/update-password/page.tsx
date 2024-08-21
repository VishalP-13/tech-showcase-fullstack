import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";
import UpdatePasswordForm from "./change-password-form";

const UpdatePasswordPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Change Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter new password to change your old password.
            </p>
          </div>
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
