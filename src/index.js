import dotenv from "dotenv"
dotenv.config()
const http = require('http');
import express from "express";
import mongoose from "mongoose";

import server from "./server";

const createServer = async() => {
    try {
      await mongoose.connect(
        `mongodb://${process.env.HOST}:27017/?gssapiServiceName=mongodb`,
        { useUnifiedTopology: true }
      );
      mongoose.set('useFindAndModify', false);

      const app = express();

      server.applyMiddleware({ app });
      const httpServer = http.createServer(app);
      server.installSubscriptionHandlers(httpServer);
      httpServer.listen({ port: process.env.PORT }, () =>
        // console.log(
        //   `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
        // )
        console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.graphqlPath}`)
      );
    } catch (error) {
      console.log(error);
    }
};

createServer();
