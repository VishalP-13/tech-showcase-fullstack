"use client";

import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Icons } from "@/components/ui/icons";
import { ErrorResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const getSchema = (mode: "signup" | "register" | "login") => {
  if (mode === "login") {
    return z.object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    });
  } else {
    return z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    });
  }
};

type FormData = {
  name?: string;
  email: string;
  password: string;
};

interface UserFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "signup" | "register" | "login";
  onSuccess?: () => void;
}

export function UserForm({
  mode,
  className,
  onSuccess,
  ...props
}: UserFormProps) {
  const [loading, setLoading] = React.useState<string | null>(null); // Manage loading state for each action
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<FormData | null>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showRegisteredPassword, setShowRegisteredPassword] =
    React.useState<boolean>(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(getSchema(mode)),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading("credentials");
    setError(null);
    try {
      if (mode === "signup") {
        await axios.post("http://localhost:8080/user/signup", data);
        router.push("/");
      } else if (mode === "register") {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/posts",
          data,
        );
        setUser(response.data);
      } else if (mode === "login") {
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
      }
      if (onSuccess) onSuccess();
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
          {mode !== "login" && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                disabled={loading !== null || !!user}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600">{errors.name?.message as string}</p>
              )}
            </div>
          )}
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
              disabled={loading !== null || !!user}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email?.message as string}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              //   type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={loading !== null || !!user}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute ml-[320px] pt-2 flex items-center text-gray-500"
              // className="absolute pl-[320px] pt-2 flex items-center text-gray-500"

              style={{ pointerEvents: "all" }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
            {errors.password && (
              <p className="text-red-600">
                {errors.password?.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading !== null || !!user}>
            {loading === "credentials" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === "signup"
              ? "Sign Up"
              : mode === "register"
                ? "Register"
                : "Sign In"}
          </Button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
      {mode === "login" && (
        <>
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
              disabled={loading !== null}
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
              disabled={loading !== null}
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
        </>
      )}
      {user && mode === "register" && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl mb-4 font-semibold text-green-900">
            User Registered Successfully ✅
          </h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <div className="flex items-center">
            <strong>Password:</strong>
            <span className="ml-2">
              {showRegisteredPassword
                ? user.password
                : user.password.replace(/./g, "*")}
            </span>
            <button
              onClick={() => setShowRegisteredPassword(!showRegisteredPassword)}
              className="ml-2 text-blue-500"
            >
              {showRegisteredPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <Button
            onClick={() => {
              setUser(null);
              reset();
            }}
            className="mt-6"
          >
            Register Another User
          </Button>
        </div>
      )}
    </div>
  );
}
