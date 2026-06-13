import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge tailwind classes. */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}
