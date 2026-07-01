import { GraphQLError } from "graphql/error";
import { prisma as db } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import { builder } from "./builder";

builder.prismaObject("Organization", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    teams: t.relation("teams"),
    organizationMembers: t.relation("organizationMembers"),
    projects: t.relation("projects"),
  }),
});

builder.prismaObject("OrganizationMember", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    role: t.exposeString("role"),
    userId: t.exposeString("userId"),
    user: t.relation("user"),
    organizationId: t.exposeString("organizationId"),
    organization: t.relation("organization"),
  }),
});

builder.prismaObject("Team", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    organization: t.relation("organization"),
    teamMembers: t.relation("teamMembers"),
    memberCount: t.relationCount("teamMembers"),
  }),
});

builder.prismaObject("TeamMember", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    teamId: t.exposeString("teamId"),
    team: t.relation("team"),
    userId: t.exposeString("userId"),
    user: t.relation("user"),
  }),
});
// TODO: boilerplate
builder.prismaObject("Invitation", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("Project", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("Page", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("Group", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("UserProjectRole", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("TeamProjectRole", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("Session", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("Account", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
builder.prismaObject("Verification", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});

builder.queryType({});
builder.queryFields((t) => ({
  // get all organizations the user belongs to
  organizations: t.prismaField({
    type: ["Organization"],
    resolve: (query, _parent, _args, ctx) => {
      if (!ctx.user) throw new GraphQLError("Unauthorized");

      return db.organization.findMany({
        ...query,
        where: {
          organizationMembers: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
      });
    },
  }),
}));

interface DeleteOrganizationResult {
  success: boolean;
  message: string;
}
const DeleteOrganizationResultRef = builder.objectRef<DeleteOrganizationResult>(
  "DeleteOrganizationResult",
);
DeleteOrganizationResultRef.implement({
  fields: (t) => ({
    success: t.exposeBoolean("success"),
    message: t.exposeString("message"),
  }),
});

builder.mutationType({});
builder.mutationFields((t) => ({
  createOrganization: t.prismaField({
    type: "Organization",
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!ctx.user) throw new GraphQLError("Unauthorized");
      try {
        const org = await db.organization.create({
          ...query,
          data: {
            name: args.name,
            // assign user as owner
            organizationMembers: {
              create: [
                {
                  userId: ctx.user.id,
                  role: "OWNER",
                },
              ],
            },
          },
        });

        return org;
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new GraphQLError("This name is taken!");
        }
      }
    },
  }),
  updateOrganization: t.prismaField({
    type: "Organization",
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, ctx) => {
      if (!ctx.user) throw new GraphQLError("Unauthorized");

      // get user from organization if they are an owner
      const organizations = await db.organization.findFirst({
        where: {
          id: args.id,
          organizationMembers: {
            some: {
              userId: ctx.user.id,
              role: "OWNER",
            },
          },
        },
      });

      // only owners of this organization can change the name
      if (!organizations) throw new GraphQLError("Unauthorized");

      try {
        const result = await db.organization.update({
          ...query,
          where: {
            id: args.id,
          },
          data: {
            name: args.name,
          },
        });

        return result;
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new GraphQLError("This name is taken!");
        }
      }
    },
  }),
  deleteOrganization: t.field({
    args: {
      id: t.arg.id({ required: true }),
    },
    type: DeleteOrganizationResultRef,
    resolve: async (_parent, args, ctx) => {
      if (!ctx.user) throw new GraphQLError("Unauthorized!");

      const result = await db.organization.deleteMany({
        where: {
          id: args.id,
          // include role check
          organizationMembers: {
            some: {
              userId: ctx.user.id,
              role: "OWNER",
            },
          },
        },
      });

      if (result.count === 0) {
        return { success: false, message: "Failed to delete organization." };
      }

      return { success: true, message: "Successfully deleted organization." };
    },
  }),
}));

builder.queryFields((t) => ({
  teams: t.prismaField({
    type: ["Team"],
    args: {
      organizationId: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!ctx.user) throw new GraphQLError("Unauthorized");

      const organization = await db.organization.findFirst({
        where: {
          id: args.organizationId,
          organizationMembers: {
            some: {
              userId: ctx.user.id,
              OR: [
                {
                  role: "MEMBER",
                },
                {
                  role: "ADMIN",
                },
                {
                  role: "OWNER",
                },
              ],
            },
          },
        },
      });

      if (!organization) throw new GraphQLError("Unauthorized");

      const teams = await db.team.findMany({
        ...query,
        where: {
          organizationId: args.organizationId,
        },
      });

      return teams;
    },
  }),
}));
builder.mutationFields((t) => ({
  createTeam: t.prismaField({
    type: "Team",
    args: {
      organizationId: t.arg.id({ required: true }),
      teamName: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!ctx.user) throw new GraphQLError("Unauthorized");

      const organization = await db.organization.findFirst({
        where: {
          id: args.organizationId,
          organizationMembers: {
            some: {
              userId: ctx.user.id,
              OR: [
                {
                  role: "OWNER",
                },
                {
                  role: "ADMIN",
                },
              ],
            },
          },
        },
      });

      if (!organization) throw new GraphQLError("Unauthorized");

      const result = await db.team.create({
        ...query,
        data: {
          organizationId: args.organizationId,
          name: args.teamName,
        },
      });

      return result;
    },
  }),
}));

export const schema = builder.toSchema();
