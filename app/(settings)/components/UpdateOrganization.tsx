"use client";

import { type SubmitEvent, useState } from "react";
import { gql, useMutation } from "urql";
import { Button } from "@/app/components/Button";
import { cn } from "@/lib/util";
import type { Organization } from "@/prisma/generated/prisma/client";

const UpdateOrganizationMutation = gql`
  mutation UpdateOrganizationMutation($id: ID!, $name: String!) {
    updateOrganization (id: $id, name: $name) {
      id
    }
  }
`;

export default function UpdateOrganizationForm({
  organization,
}: {
  organization: Organization;
}) {
  const [name, setName] = useState(organization.name);
  const [gqlError, setError] = useState<string | null>(null);
  const [{ fetching, error }, updateOrganization] = useMutation(
    UpdateOrganizationMutation,
  );

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim() === organization.name) return;

    const response = await updateOrganization({
      name: name.trim(),
      id: organization.id,
    });

    if (response?.error) {
      setError(response.error.graphQLErrors[0].message);
    }
  };

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
      <div
        className="bg-red-300! shadow-[3px_3px_0_#222222] border-2 border-dashed mb-3 p-2"
        hidden={!error}
      >
        {gqlError}
      </div>
      <label htmlFor="update-organization-name">Update Organization Name</label>
      <div className="flex gap-3">
        <input
          type="text"
          className="py-1 px-2 border-2 shadow-[3px_3px_0_#222222] outline-0 focus:shadow-[#69a2ce] min-w-60 max-w-100 w-full"
          placeholder="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={fetching}
          id="update-organization-name"
        ></input>
        <Button
          type="submit"
          disabled={fetching || name === organization.name}
          className={cn(
            "disabled:cursor-not-allowed disabled:transition-none disabled:transform-none! disabled:shadow-[3px_3px_0px_#222222]! disabled:opacity-80",
            "bg-[#69a2ce]!",
          )}
        >
          Update
        </Button>
      </div>
    </form>
  );
}
