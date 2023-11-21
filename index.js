// Import ApolloServer from apollo-server to set up the GraphQL server
const { ApolloServer } = require("apollo-server"); 

// Import schema from graphql-import to load schema.graphql
const { importSchema } = require("graphql-import");

// Import custom data source class 
const EtherDataSource = require("./datasource/ethDatasource");

// Load schema from schema.graphql file
const typeDefs = importSchema("./schema.graphql"); 

// Load environment variables from .env file
require("dotenv").config();

// Define resolvers that map schema fields to data source methods
const resolvers = {
  Query: {
    etherBalanceByAddress: (root, _args, { dataSources }) => 
      dataSources.ethDataSource.etherBalanceByAddress(),

    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
  // Pass data source class to constructor
  dataSources: () => ({
    ethDataSource: new EtherDataSource(), 
  }), 
});

// Disable response timeout
server.timeout = 0; 

// Start server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`); 
});