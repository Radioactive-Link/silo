"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { authClient, useSession } from "@/lib/auth-client";

export default function UserInfo() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [userNameDelete, setUserNameDelete] = useState("");

  if (isPending || !session?.user) {
    return;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl">Profile</h3>
      <div className="flex items-end gap-2">
        <div className="flex flex-col justify-between grow">
          <label htmlFor="user-name-input">Name</label>
          <input
            id="user-name-input"
            value={session?.user.name ?? ""}
            className="min-w-20 w-80 border-2 px-2 py-1 outline-none focus:shadow-[3px_3px_0_#69a2ce] disabled:opacity-80"
            disabled
          ></input>
        </div>
        <Image
          src={session?.user?.image ?? ""}
          alt="user profile picture"
          width="50"
          className="w-[50px] h-[50px] border-2 border-[#222222]!"
          height="50"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="user-email-input">Email</label>
        <input
          id="user-email-input"
          value={session?.user.email ?? ""}
          className="min-w-20 w-80 border-2 px-2 py-1 outline-none focus:shadow-[3px_3px_0_#69a2ce] disabled:opacity-80"
          disabled
        ></input>
      </div>
      <div className="pt-3">
        <div className="relative flex border-3 border-red-400! border-dashed p-3">
          <strong className="absolute -top-4 left-2 text-red-400 px-1 bg-foreground text-xl">
            Danger
          </strong>
          <div className="flex flex-col gap-2">
            <p>Enter your username to confirm. You cannot undo this action.</p>
            <div className="flex gap-2">
              <input
                id="user-name-delete-input"
                value={userNameDelete}
                className="min-w-20 w-80 border-2 px-2 py-1 outline-none focus:shadow-[3px_3px_0_#ffa2a2] disabled:opacity-80"
                placeholder="username"
                onChange={(e) => setUserNameDelete(e.target.value)}
              ></input>
              <Button
                className="w-fit bg-red-300! disabled:opacity-50 disabled:transition-none! disabled:transform-none! disabled:hover:shadow-[3px_3px_0_#222222]! disabled:cursor-not-allowed"
                disabled={userNameDelete !== session?.user.name}
                onClick={async (_) =>
                  await authClient.deleteUser().finally(() => router.push("/"))
                }
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
