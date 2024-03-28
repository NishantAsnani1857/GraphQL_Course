const { Query } = require('./Resolvers/Query');
const { typeDefs } = require('./schema')
const { Category } = require('./Resolvers/categories')
const { Product } = require('./Resolvers/products')
const { db } = require('./db');
const { ApolloServer } = require('apollo-server');
const { Mutation } = require('./Resolvers/Mutation');


const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query,
        Category,
        Product,
        Mutation
    },
    context:{
        db
    }
});

server.listen().then(({ url }) => {
    console.log("Server is ready at " + url)
})