import { Client, cacheExchange, fetchExchange } from "urql";

export const urql = new Client({
  url: "/api/gql/",
  exchanges: [cacheExchange, fetchExchange],
});
