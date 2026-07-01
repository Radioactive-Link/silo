import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/util";

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-w-20 grow border-2 px-2 py-1 outline-none focus:shadow-[3px_3px_0_#69a2ce] disabled:opacity-50",
        className,
      )}
      {...props}
      type="text"
    ></input>
  );
}
