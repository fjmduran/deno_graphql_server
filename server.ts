import { Server } from "https://deno.land/std@0.166.0/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql@1.1.2/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";
import { readJsonSync } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";
import {ArticleInterface} from "./article.interface.ts"

const articlesRaw = readJsonSync('./articles.json');
const articlesString=JSON.stringify(articlesRaw);
const articles=JSON.parse(articlesString, (key, value) => {
  if (key === "edad") {
    return parseInt(value);
  } else {
    return value;
  }
}) as ArticleInterface[];

const typeDefs = gql`
  type Query {
    hello: String
    articlesCount: Int!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hola mundo!",
    articlesCount: () => articles.length
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

const server = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

server.listenAndServe();