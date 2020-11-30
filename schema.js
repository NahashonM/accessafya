const {
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLList, 
    GraphQLSchema
} = require("graphql");

const mongoClient = require('mongodb').MongoClient;

const typeUser = new GraphQLObjectType({
    name: "user",
    fields: () => ({
        user_id: { type: GraphQLString},
        first_name: { type: GraphQLString},
        last_name: { type: GraphQLString},
        email: { type: GraphQLString}
    })
});


//  RootQuery
//--------------------------------------------
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        users: {
            type: new GraphQLList(typeUser),
            resolve(parent, args) {
                return [{}, {}, {}]
            }
        },

        user: {
            type: typeUser,
            args: {
                user_id: { type: GraphQLString}
            },
            resolve(parent, args) {
                return [{}]
            }
        }

    }
});



module.exports = new GraphQLSchema({
    query: RootQuery
})