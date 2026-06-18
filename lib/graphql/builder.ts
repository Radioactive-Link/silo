import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import { DateTimeResolver } from "graphql-scalars";
import { prisma } from "@/lib/prisma";
import type PrismaTypes from "@/prisma/generated/pothos-prisma-types";
import { getDatamodel } from "@/prisma/generated/pothos-prisma-types";
import { User } from "@/prisma/generated/prisma/client";

// see: https://pothos-graphql.dev/docs/plugins/prisma/setup#set-up-the-builder
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  Context: {
    user: User | null;
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    exposeDescriptions: true,
    // warn when not using a query parameter correctly
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});
