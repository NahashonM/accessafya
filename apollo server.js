const express = require('express');
var mongoose = require("mongoose");
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const dbName = "db_accessafya";
const dbPort = 27017;
const dbUrl = 'localhost';
const serverPort = process.env.GRAPHQL_APP_PORT || 4000;


const StartServer = async () => {
	const app = express();
	const server = new ApolloServer({ 
							typeDefs, 
							resolvers,
							playground: true,
						});

	server.applyMiddleware({ app, path: ['/', '/graphql', '/graphiql'] });

	try {
		await mongoose.connect( `mongodb://${dbUrl}:${dbPort}/${dbName}`, { useNewUrlParser: true });
		console.info(`Connected to database on Worker process: ${process.pid}`)
    } catch (error) {
        console.error(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
        process.exit(1)
	}
	

	app.listen({ port: serverPort }, () => {
		console.log(`Server started at http://localhost:${serverPort}${server.graphqlPath}`)
	});
}


StartServer();