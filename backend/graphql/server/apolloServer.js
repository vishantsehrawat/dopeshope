const { ApolloServer, gql } = require("apollo-server-express");

const { typeDefs } = require("../schemas/user.type");
const { resolvers } = require("../resolvers/user.resolver");

// ^ apollo server
const apolloServer = new ApolloServer({
  // apollo sever takes 2 objects which are necessary for gql to work ie type def and resolvers
  typeDefs,
  resolvers,
});

module.exports = { apolloServer };
