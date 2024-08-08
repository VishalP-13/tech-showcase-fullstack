"use client";

import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { ErrorResponse } from "@/lib/types";
import Link from "next/link";

// Define the validation schema using Zod
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginData = {
  name: string;
  email: string;
  password: string;
};

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const [loading, setLoading] = React.useState<string | null>(null); // Manage loading state for each action
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setLoading("form");
    setError(null);
    try {
      const response = await signIn(
        "credentials",
        {
          email: data.email,
          password: data.password,
          redirect: true,
        },
        { callbackUrl: "http://localhost:3000" },
      );

      if (response?.error) {
        setError(response.error);
      }
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "http://localhost:3000" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading === "form"}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message as string}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={loading === "form"}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading === "form"}>
            {loading === "form" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
      <p className="px-40 text-center text-sm text-muted-foreground pr-0">
        <Link
          href="/reset-password"
          className="underline underline-offset-4 hover:text-primary"
        >
          Forgot Password?{" "}
        </Link>{" "}
      </p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={loading === "google"}
          onClick={() => handleSocialSignIn("google")}
        >
          {loading === "google" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={loading === "github"}
          onClick={() => handleSocialSignIn("github")}
        >
          {loading === "github" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>
    </div>
  );
}
