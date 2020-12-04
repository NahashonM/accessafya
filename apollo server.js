const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const serverPort = process.env.GRAPHQL_APP_PORT || 4000;

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.applyMiddleware({ app, path: ['/', '/graphql', '/graphiql'] });

app.listen({ port: serverPort }, () =>
  console.log(`🚀 Server ready at http://localhost:${serverPort}${server.graphqlPath}`)
);
