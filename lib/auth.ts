import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user, _request) => {
        // this will cascade to delete everything under the organization.
        /**
         * TODO: likely want to handle errors and provide info to the user.
         * Might have to make this a dedicated endpoint.
         */
        await prisma.organization.deleteMany({
          where: {
            organizationMembers: {
              some: {
                userId: user.id,
                role: "OWNER",
              },
            },
          },
        });
      },
    },
  },
});

/**
 * Redirect user to `path` if they are not authenticated. Returns the user's
 * session otherwise. Default redirect is to the home page.
 */
export async function requireAuth(path: string = "/") {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(path);
  }

  return session;
}
