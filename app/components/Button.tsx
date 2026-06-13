"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/util";

export const Button = ({
  type = "button",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type={type}
    className={cn("py-1 px-2 border-[#222222] border-2", className)}
    {...props}
  />
);
