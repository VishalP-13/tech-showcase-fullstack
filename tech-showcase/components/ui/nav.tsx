"use client";

import React from "react";
import Link from "next/link";
import { LogIn, LogOut, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
// import { buttonVariants } from "@ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
// import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import UserAvatarComponent from "../user-avatar";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
    onClick?: () => void; // Add onClick handler
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <div className="mb-[40px]">
          {session && (
            <div className="flex">
              <UserAvatarComponent
                imageUrl={session?.user?.image}
                name={session?.user?.name}
                size={42}
              />
              {!isCollapsed && (
                <h1 className="mt-[10px] ml-[10px]">
                  {session.user?.name?.split(" ")[0] || "user"}
                </h1>
              )}
            </div>
          )}
        </div>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant:
                          link.href.split("/")[1] === pathname.split("/")[1]
                            ? "default"
                            : "ghost",
                        size: "icon",
                      }),
                      "h-9 w-9",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  buttonVariants({
                    variant:
                      link.href.split("/")[1] === pathname.split("/")[1]
                        ? "default"
                        : "ghost",
                    size: "sm",
                  }),
                  link.variant === "default" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start",
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" &&
                        "text-background dark:text-white",
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            ),
          )}
          <div className="mt-4">
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  {session ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="h-9 w-9 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Log Out</span>
                    </Button>
                  ) : (
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      )}
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="sr-only">Log In</span>
                    </Link>
                  )}
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {session ? "Log Out" : "Log In"}
                </TooltipContent>
              </Tooltip>
            ) : session ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    variant: pathname === "/login" ? "default" : "ghost",
                    size: "sm",
                  }),
                  "w-full justify-start dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                )}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
