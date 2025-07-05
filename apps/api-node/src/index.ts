import express from "express";
import { ApolloServer } from "apollo-server-express";
import { gql } from "graphql-tag";

const typeDefs = gql`type Query { hello: String! }`;
const resolvers = { Query: { hello: () => "world" } };

async function start() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app: app as any });
  app.listen(4000, () =>
    console.log(`▶️  API ready at http://localhost:4000${server.graphqlPath}`)
  );
}
start(); 