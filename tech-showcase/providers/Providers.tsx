"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import { Session } from "@/lib/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import AuthLayout from "../../layouts/AuthLayout";

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

const queryClient = new QueryClient();

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {/* <AuthLayout> */}
        {children}
        {/* </AuthLayout> */}
      </QueryClientProvider>
    </SessionProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  session: PropTypes.object,
};

export default Providers;
