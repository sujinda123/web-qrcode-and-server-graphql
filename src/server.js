import fs from "fs"
import path from "path"
const DataLoader = require('dataloader')
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
    context: async ({ req, connection }) => {
      if (connection) {
        // check connection for metadata
        return connection.context;
      } else {
        const token = req.headers.authorization || "";
        const auth_username = getUser(token)

        return {
          auth_username, 
          token,
          userModel,
          assetModel,
          dataloaders: {
            users: new DataLoader(async userIds => {
              const users = await userModel.getUsersByIds(userIds)
              return userIds.map(userId => users.find(user => String(user._id) === String(userId)))
            }),
            assets: new DataLoader(async assetIds => {
              const assets = await assetModel.getAssetsByUserIds(assetIds)
            return assetIds.map(assetId => assets.filter(asset => String(asset.createdBy) === String(assetId)))
            }),
          }
        }
      }
      
    }
    
});

export default server;