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

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdatePasswordData = {
  password: string;
  confirmPassword: string;
};

interface UpdatePasswordFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function UpdatePasswordForm({
  className,
  ...props
}: UpdatePasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<UpdatePasswordData> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming you have a valid token in the query params
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) {
        throw new Error("Invalid or missing token");
      }

      await axios.post("http://localhost:8080/user/update-password", {
        token,
        newPassword: data.password,
      });

      // Redirect to a success page or show a success message
      router.push("/login");
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              New Password
            </Label>
            <Input
              id="password"
              placeholder="New Password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-600">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Change Password
          </Button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </div>
  );
}
