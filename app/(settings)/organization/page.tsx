"use client";

import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { gql, useMutation } from "urql";
import { Button } from "@/app/components/Button";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { useOrganization } from "@/app/providers/OrganizationProvider";
import UpdateOrganizationForm from "../components/UpdateOrganization";

const DeleteOrganizationMutation = gql`
  mutation DeleteOrganizationMutation($id: ID!) {
    deleteOrganization(id: $id) {
      success
      message
    }
  }
`;

export default function OrganizationPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const [userOrganizationDelete, setUserOrganizationDelete] = useState("");
  const [error, setError] = useState("");
  const [{ fetching }, deleteOrganization] = useMutation(
    DeleteOrganizationMutation,
  );
  if (!organization) return;

  const handleDelete = async (_e: MouseEvent<HTMLButtonElement>) => {
    const result = await deleteOrganization({
      id: organization.id,
    });
    if (result?.error && result.error.graphQLErrors.length > 0) {
      setError(result.error.graphQLErrors[0].message);
      return;
    }
    if (result?.data) {
      if (result.data?.success === false) {
        setError(result.data.message);
      } else {
        router.push("/user/organizations");
      }
    }
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <h2>Organization</h2>
      <HorizontalDivider />
      <div className="mt-4 flex flex-col gap-6">
        <UpdateOrganizationForm
          key={organization.id}
          organization={organization}
        />
        <div className="relative flex flex-col border-3 border-red-400! border-dashed p-3 gap-5">
          <strong className="absolute -top-4 left-2 text-red-400 px-1 bg-foreground text-xl">
            Danger
          </strong>

          <div className="flex flex-col gap-2">
            <strong>Delete Organization</strong>
            {error ? (
              <div className="bg-red-300! p-2 border-2 border-[#222222] shadow-[2px_2px_0_#222222]">
                {error}
              </div>
            ) : (
              ""
            )}
            <p>
              Enter the organization name to confirm. You cannot undo this
              action.
            </p>
            <div className="flex gap-2">
              <input
                id="user-name-delete-input"
                value={userOrganizationDelete}
                className="min-w-20 w-80 border-2 px-2 py-1 outline-none focus:shadow-[3px_3px_0_#ffa2a2] disabled:opacity-80"
                placeholder="organization name"
                onChange={(e) => setUserOrganizationDelete(e.target.value)}
                disabled={fetching}
              ></input>
              <Button
                className="w-fit bg-red-300! disabled:opacity-50 disabled:transition-none! disabled:transform-none! disabled:hover:shadow-[3px_3px_0_#222222]! disabled:cursor-not-allowed"
                disabled={
                  userOrganizationDelete !== organization?.name || fetching
                }
                onClick={handleDelete}
              >
                Delete Organization
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
