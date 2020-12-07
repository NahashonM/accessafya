const express = require('express');
var mongoose = require("mongoose");
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const dbName = "db_accessafya";
const dbPassword = 'guzCFQCHuHl3P7T6';
const dbUrl = `mongodb+srv://user-heroku:${dbPassword}@cluster-x.a4rbp.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const serverPort = process.env.GRAPHQL_APP_PORT || 4000;


const StartServer = async () => {
	const app = express();
	const server = new ApolloServer({ 
							typeDefs, 
							resolvers,
							introspection: true,
							playground: true
						});

	server.applyMiddleware({ app, path: ['/', '/graphql', '/graphiql'] });

	try {
		await mongoose.connect( dbUrl, { useNewUrlParser: true,  useUnifiedTopology: true });
		console.info(`Connected to database on Worker process: ${process.pid}`)
    } catch (error) {
        console.error(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
        process.exit(1)
	}
	
	

	app.listen({ port: serverPort }, () => {
		console.log(`Server started on port: ${serverPort} paths: ${server.graphqlPath}`)
	});
}


StartServer();