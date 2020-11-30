const { ApolloServer, gql } = require('apollo-server');
const schema = require("./schema");


const apolloServer = new ApolloServer({  schema });
const serverPort = process.env.GRAPHQL_APP_PORT || 4000;


apolloServer.listen(serverPort).then(( { url } ) => {
    console.log(`Server ready at ${url}`)
});


