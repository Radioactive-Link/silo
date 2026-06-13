import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { prisma } from "./prisma";

/** Server auth client. */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  experimental: {
    // improves some query performance
    // see: https://better-auth.com/docs/adapters/prisma#joins-experimental
    joins: true,
  },
});
