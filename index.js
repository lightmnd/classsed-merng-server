// require('dotenv').config({ path: __dirname + '/.env' });
const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
// const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => ({ req, pubsub })
});

const app = express();

mongoose
	.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
  console.log('MongoDB Connected');
  return app.listen(PORT || 4000, function () {
    console.log('Server listening on port 4000');
  });
})
	.then(() => {
  app.use('/images', express.static(path.join(__dirname, '/graphql/images')));
  server.applyMiddleware({ app });
})
	.catch(err => {
  console.error(err);
});
