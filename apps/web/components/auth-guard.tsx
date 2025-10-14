"use client";

import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import LandingLayout from "@/modules/auth/ui/layouts/landing-layout";
import LandingPage from "@/modules/landing/LandingPage";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>
        <AuthLayout>{children}</AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <LandingLayout>
          <LandingPage />
        </LandingLayout>
      </Unauthenticated>
    </>
  );
};
