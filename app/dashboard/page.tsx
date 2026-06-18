import { HorizontalDivider } from "../components/HorizontalDivider";
import CreateOrganization from "./components/CreateOrganization";
import LandingPage from "./components/LandingPage";
import Organizations from "./components/Organizations";

export default function DashboardPage() {
  return (
    <LandingPage>
      <div className="w-full flex flex-col gap-2">
        <h2>Organizations</h2>
        <HorizontalDivider />
        <Organizations />
      </div>
      <CreateOrganization />
    </LandingPage>
  );
}
