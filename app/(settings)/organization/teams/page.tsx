import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import CreateTeam from "../../components/CreateTeam";
import ListTeams from "../../components/ListTeams";

export default function OrganizationTeamsPage() {
  return (
    <div className="w-full flex-1 flex flex-col gap-2">
      <h2>Teams</h2>
      <HorizontalDivider />
      <ListTeams />
      <HorizontalDivider />
      <CreateTeam />
    </div>
  );
}
