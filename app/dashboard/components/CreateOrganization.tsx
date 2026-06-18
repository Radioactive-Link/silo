"use client";
import { type SubmitEvent, useState } from "react";
import { gql, useMutation } from "urql";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";

const CreateOrganizationMutation = gql`
  mutation CreateOrganization($name: String!) {
    createOrganization(name: $name) {
      name
    }
  }
`;

export default function CreateOrganization() {
  const [{ fetching, data }, createOrganization] = useMutation(
    CreateOrganizationMutation,
  );
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    if (!orgName.trim()) {
      setError("Please enter a non-empty value");
      return;
    }

    const result = await createOrganization({
      name: orgName,
    });

    if (result.data?.createOrganization) {
      setOrgName("");
      setError("");
    } else {
      setError(result.error?.graphQLErrors[0].message ?? "");
    }
  };

  const errorBox = error ? (
    <div className="bg-red-300! p-2 border-2 border-[#222222] shadow-[2px_2px_0_#222222]">
      {error}
    </div>
  ) : null;

  const successBox = data?.createOrganization ? (
    <div className="bg-emerald-300! p-2 border-2 border-[#222222] shadow-[2px_2px_0_#222222]">
      Success!
    </div>
  ) : null;

  return (
    <div className="w-full flex flex-col gap-3">
      <h2>Create Organization</h2>
      <HorizontalDivider />
      {errorBox}
      {successBox}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <label htmlFor="org-name-input">Organization Name</label>
        <div className="flex gap-2 w-full">
          <input
            value={orgName}
            id="org-name-input"
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Organization Name"
            className="min-w-20 grow border-2 px-2 py-1 outline-none focus:shadow-[3px_3px_0_#69a2ce] disabled:opacity-50"
            disabled={fetching}
          ></input>
          <button
            type="submit"
            className="w-fit px-2 bg-emerald-300! border-2 disabled:opacity-50 disabled:transition-none! disabled:transform-none! disabled:hover:shadow-[3px_3px_0_#222222]! cursor-not-allowed"
            disabled={fetching || !orgName}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
