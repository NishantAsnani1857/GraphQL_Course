import { ApolloServer } from "apollo-server";
import { typeDefs } from './Schema'
import {Query,Mutation,Profile,Post,User} from './Resolvers/index'
import { PrismaClient, Prisma } from '@prisma/client'
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient()

export interface Context {
    prisma:PrismaClient<Prisma.PrismaClientOptions,never>,
    userInfo: {
        userId: number
    } | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User
    },
    context: ({ req }: any): Context => {
        const userInfo = getUserFromToken(req.headers.authorization)
        return {
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log("Server listening at " + url);
})