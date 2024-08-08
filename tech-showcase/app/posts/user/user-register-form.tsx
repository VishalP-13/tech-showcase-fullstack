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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type UserRegisterData = {
  name: string;
  email: string;
  password: string;
};

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const [user, setUser] = React.useState<UserRegisterData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserRegisterData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<UserRegisterData> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        data,
      );
      setUser(response.data);
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAnotherUser = () => {
    setUser(null);
    reset();
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
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
              disabled={isLoading || !!user}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message as string}</p>
            )}
          </div>
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
              disabled={isLoading || !!user}
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
              disabled={isLoading || !!user}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading || !!user}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
          </Button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
      {user && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold text-green-900">
            User Registered Successfully ✅
          </h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <Button onClick={handleRegisterAnotherUser} className="mt-6">
            Register Another User
          </Button>
        </div>
      )}
    </div>
  );
}
