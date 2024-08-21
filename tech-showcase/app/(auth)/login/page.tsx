import React from "react";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserForm from "@/components/user-form";

const AuthenticationPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to login to your account
            </p>
          </div>
          <UserForm mode="login" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Signup
            </Link>{" "}
          </p>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking Sign In, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service and Privacy Policy.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
