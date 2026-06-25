"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { useOrganization } from "@/app/providers/OrganizationProvider";
import UpdateOrganizationForm from "../components/UpdateOrganization";

export default function OrganizationPage() {
  const { organization } = useOrganization();
  if (!organization) return;

  return (
    <div className="w-full flex flex-col flex-1">
      <h2>Organization</h2>
      <HorizontalDivider />
      <div className="mt-4 flex flex-col gap-1">
        <UpdateOrganizationForm
          key={organization.id}
          organization={organization}
        />
      </div>
    </div>
  );
}
