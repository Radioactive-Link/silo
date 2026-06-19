"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { cn } from "@/lib/util";

// group: [url, display name]
const navs: Map<string, [string, string][]> = new Map([
  [
    "Account",
    [
      ["/user", "General"],
      ["/user/organizations", "Organizations"],
    ],
  ],
  [
    "Organization",
    [
      ["/organization", "General"],
      ["/organization/teams", "Teams"],
      ["/organization/members", "Members"],
    ],
  ],
]);

export default function Sidebar() {
  const path = usePathname();
  return (
    <nav className="w-full flex flex-col gap-10 p-4">
      {Array.from(navs.entries()).map(([group, urls]) => (
        <div key={group} className="w-full flex flex-col gap-2">
          <div className="flex flex-col">
            <h3>{group}</h3>
            <HorizontalDivider />
          </div>
          {urls.map(([url, name]) => (
            <Link
              key={name}
              href={url}
              className={cn(
                "hover:underline ",
                path === url ? "font-bold" : "",
              )}
            >
              {name}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
