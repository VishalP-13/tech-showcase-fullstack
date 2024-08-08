"use client";

import React, { useEffect, useState } from "react";
import { Nav } from "@/components/ui/nav";
import {
  File,
  Home,
  User,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "./ui/button";

const SideNavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="fixed min-w-[80px] border-r px-3 pb-10 pt-20"
      style={{ minHeight: "100vh" }} // Ensures full height of the viewport
    >
      {!isMobile && (
        <div className="absolute right-[-20px] top-7">
          <Button
            variant="secondary"
            className="rounded-full p-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={isMobile ? true : isCollapsed}
        links={[
          {
            title: "Home",
            icon: Home,
            variant: "default",
            href: "/",
          },
          {
            title: "Posts",
            icon: File,
            variant: "ghost",
            href: "/posts",
          },
          {
            title: "Profile",
            icon: User,
            variant: "ghost",
            href: "/user",
          },
          {
            title: "Users",
            icon: Users,
            variant: "ghost",
            href: "/users",
          },
        ]}
      />
    </div>
  );
};

export default SideNavBar;
