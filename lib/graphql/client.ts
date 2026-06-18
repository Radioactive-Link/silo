import { Client, cacheExchange, fetchExchange } from "urql";

export const urql = new Client({
  url: "http://localhost:3000/api/gql/",
  exchanges: [cacheExchange, fetchExchange],
});
