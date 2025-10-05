"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { OrgSelectionView } from "@/modules/auth/ui/views/org-selection-view";

const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <AuthLayout>
        <div>Loading...</div>
      </AuthLayout>
    );
  }

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectionView />
      </AuthLayout>
    );
  }
  return <AuthLayout>{children}</AuthLayout>;
};

export default OrganizationGuard;
