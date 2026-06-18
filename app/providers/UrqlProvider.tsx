"use client";

import { Provider } from "urql";
import { urql } from "@/lib/graphql/client";

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={urql}>{children}</Provider>;
}
