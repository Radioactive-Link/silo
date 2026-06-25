"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { Button } from "./Button";
import OrganizationCtxDropdown from "./OrganizationCtxDropdown";

export const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const rightModule = (() => {
    if (isPending) return;
    if (session?.user) {
      return (
        <div className="bg-inherit! flex flex-row gap-2 items-center">
          <Button onClick={() => signOut()}>Sign Out</Button>
          <Image
            src={session.user.image as string}
            alt="user's profile picture"
            width="30"
            height="30"
            className="border-2 border-[#222222] h-full w-fit shadow-[3px_3px_0_#222222]"
            onClick={() => router.push("/dashboard")}
          />
        </div>
      );
    } else {
      return <Button onClick={() => signIn()}>Sign In</Button>;
    }
  })();

  return (
    <div className="w-full">
      <nav className="w-full p-3 flex flex-row justify-between bg-orange-200">
        <div className="flex gap-2 bg-inherit!">
          <Button onClick={() => router.push("/")}>Home</Button>
          <OrganizationCtxDropdown />
        </div>
        {rightModule}
      </nav>
    </div>
  );
};
