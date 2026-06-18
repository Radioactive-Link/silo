import { createYoga } from "graphql-yoga";
import { auth } from "@/lib/auth";
import { schema } from "@/lib/graphql/schema";

// see: https://the-guild.dev/graphql/yoga-server/docs/integrations/integration-with-nextjs#example

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  graphqlEndpoint: "/api/gql",
  schema,
  fetchAPI: { Response },
  context: async (req) => {
    const session = await auth.api.getSession({ headers: req.request.headers });

    return {
      user: session?.user ?? null,
    };
  },
  healthCheckEndpoint: "/health",
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
