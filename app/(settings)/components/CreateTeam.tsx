"use client";
import { type SubmitEvent, useState } from "react";
import { gql, useMutation } from "urql";
import { Button } from "@/app/components/Button";
import { TextInput } from "@/app/components/TextInput";
import { useOrganization } from "@/app/providers/OrganizationProvider";

const CreateTeamMutation = gql`
  mutation CreateTeam($organizationId: ID!, $teamName: String!) {
    createTeam(organizationId: $organizationId, teamName: $teamName) {
      id
    }
  }
`;

export default function CreateTeam() {
  const { organization } = useOrganization();
  const [{ fetching }, createTeam] = useMutation(CreateTeamMutation);
  const [teamName, setTeamName] = useState("");
  if (!organization) return;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!teamName.trim()) return;

    const result = await createTeam({
      organizationId: organization.id,
      teamName,
    });

    if (result?.error) {
      // error
    } else {
      // success
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <strong>Create Team</strong>
      <label htmlFor="team-name-input">Team Name</label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <TextInput
          id="team-name-input"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="min-w-fit max-w-80"
          placeholder="team name"
          disabled={fetching}
        />
        <Button
          type="submit"
          disabled={fetching || !teamName}
          className="w-fit px-2 bg-emerald-300! border-2 disabled:opacity-50 disabled:transition-none! disabled:transform-none! disabled:hover:shadow-[3px_3px_0_#222222]! disabled:cursor-not-allowed"
        >
          Create
        </Button>
      </form>
    </div>
  );
}
