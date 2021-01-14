import fs from "fs"
import path from "path"

import { ApolloServer } from 'apollo-server-express';
import getUser from "./getUser"

import resolvers from "./resolvers/resolvers"
// import typeDefs from './schema/typeDefs';
const typeDefs = fs
    .readFileSync(path.join(__dirname, "./schema", "schema.graphql"), "utf8")
    .toString()


const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // check from req
          const token = req.headers.authorization || "";
          const userId = getUser(token)
          return { userId, token };
        }
    },
});

export default server;