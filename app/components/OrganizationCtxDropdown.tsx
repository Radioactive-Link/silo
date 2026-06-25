"use client";

import { ChevronDown } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { gql, useQuery } from "urql";
import { useOrganization } from "@/app/providers/OrganizationProvider";
import { cn } from "@/lib/util";
import type { Organization } from "@/prisma/generated/prisma/client";

const OrganizationQuery = gql`
  query OrganizationQuery {
    organizations {
      id
      name
    }
  }
`;

export default function OrganizationCtxDropdown() {
  const { organization, setOrganization } = useOrganization();
  const [{ data, fetching }, _useOrganizations] = useQuery({
    query: OrganizationQuery,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (fetching || !data?.organizations) {
      return;
    }

    // TODO: cache. localstorage?
    // default to first organization
    if (!organization && data.organizations.length > 0) {
      setOrganization(data.organizations[0]);
    }
  }, [fetching, data, organization, setOrganization]);

  useEffect(() => {
    // method from: https://stackoverflow.com/a/64665817
    const closeMenuOnOutsideClick = (e: PointerEvent) => {
      const target = document.querySelector("#organization-ctx-dropdown");
      if (target && !e.composedPath().includes(target)) {
        // click outside menu: close it
        setIsOpen(false);
      }
    };
    document.addEventListener("click", closeMenuOnOutsideClick);

    return () => {
      document.removeEventListener("click", closeMenuOnOutsideClick);
    };
  }, []);

  // only show if the user belongs to an organization
  if (fetching || !data?.organizations?.length) {
    return <Fragment />;
  }

  return (
    <div
      className="w-60 border-2 border-[#222222] relative box-border shadow-[3px_3px_0_#222222]"
      id="organization-ctx-dropdown"
    >
      <div
        className="h-full max-w-full flex items-center px-2 justify-between cursor-pointer"
        onMouseUp={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{organization?.name ?? "<Unset>"}</span>
        <ChevronDown
          className={cn(
            isOpen ? "transform-[scaleY(-1)]" : "",
            "transition-transform shrink-0",
          )}
        />
      </div>
      <div
        className={cn(
          "box-border absolute flex flex-col border-2 border-[#222222] max-w-100 top-full transition-opacity opacity-0 duration-200 -left-px z-10",
          isOpen ? "opacity-100" : "pointer-events-none",
        )}
      >
        {data?.organizations?.map((item: Organization, idx: number) => (
          <div
            key={item.id}
            className={cn(
              "px-3 py-2 w-full truncate self-end cursor-pointer hover:underline",
              data?.organizations.length - 1 === idx
                ? ""
                : "border-b-2 border-[#222222]",
            )}
            onMouseUp={() => {
              setOrganization(item);
              setIsOpen(false);
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
