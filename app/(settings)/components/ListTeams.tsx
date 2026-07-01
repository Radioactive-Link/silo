"use client";
import Link from "next/link";
import { gql, useQuery } from "urql";
import { useOrganization } from "@/app/providers/OrganizationProvider";
import type { Team } from "@/prisma/generated/prisma/client";

const ListTeamsQuery = gql`
  query ListTeams($organizationId: ID!) {
    teams(organizationId: $organizationId) {
      id
      name
      memberCount
    }
  }
`;

export default function ListTeams() {
  const { organization } = useOrganization();
  const [{ data }, _listTeams] = useQuery({
    query: ListTeamsQuery,
    variables: {
      organizationId: organization?.id,
    },
    // ensure organization.id is set when query runs
    pause: !organization,
  });

  if (!organization) return;

  return (
    <div>
      {data?.teams?.length > 0 ? (
        <table className="table-auto w-full text-left">
          <thead className="w-full">
            <tr>
              <th>Team</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {data?.teams?.map((team: Team & { memberCount: number }) => (
              <tr key={team.id}>
                <td className="truncate max-w-px">
                  <Link href="todo" className="hover:underline">
                    {team.name}
                  </Link>
                </td>
                <td className="truncate max-w-px">{team.memberCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">N/A</p>
      )}
    </div>
  );
}
