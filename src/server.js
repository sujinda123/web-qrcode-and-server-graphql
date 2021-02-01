import fs from "fs"
import path from "path"
const Dataloader = require('dataloader')
import { ApolloServer } from 'apollo-server-express';
import getUser from "./getUser"
import resolvers from "./resolvers/resolvers"

import userModel from "./models/User"
import assetModel from "./models/Asset"

const typeDefs = fs
    .readFileSync(path.join(__dirname, "./schema", "schema.graphql"), "utf8")
    .toString()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const userId = getUser(token)
      return {
        userId, 
        token,
        userModel,
        assetModel,
      }
    }
    
});

export default server;