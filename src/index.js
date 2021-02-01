import dotenv from "dotenv"
dotenv.config()
const http = require('http');
import express from "express";
import mongoose from "mongoose";

import server from "./server";

const createServer = async () => {
    try {
      await mongoose.connect(
        `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      mongoose.set('useFindAndModify', false);

      const app = express();

      server.applyMiddleware({ app });
      const httpServer = http.createServer(app);
      server.installSubscriptionHandlers(httpServer);
      httpServer.listen({ port: process.env.SERVER_PORT }, () =>
        console.log(`🚀 Subscriptions ready at ws://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}${server.graphqlPath}`)
      );
    } catch (error) {
      console.log(error);
    }
};

createServer();
