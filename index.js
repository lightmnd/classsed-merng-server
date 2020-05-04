require("dotenv").config({ path: __dirname + "/.env" });
const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const PORT = process.env.port || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => ({ req, pubsub })
});

const app = express();

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    //return server.listen({ port: PORT });
    return app.listen({ port: PORT });
  })
  .then(res => {
    console.log(`Server running at ${PORT}`);
  })
  .then(() => {
    app.use("/images", express.static(path.join(__dirname, "/graphql/images")));
    server.applyMiddleware({ app });
  })
  .catch(err => {
    console.error(err);
  });
