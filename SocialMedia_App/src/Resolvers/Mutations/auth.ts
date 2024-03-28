import { Context } from '../../index'
import validator from "validator"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

interface SignupArgs {
    name: string,
    bio?: string,
    credentials: {
        email: string,
        password: string
    }
}

interface SigninArgs {
    credentials: {
        email: string,
        password: string
    }
}

interface UserPayload {
    userErrors: {
        message: string
    }[],
    token: string | null
}


export const authResolver = {
    signup: async (parent: any,
        { name, credentials, bio }: SignupArgs,
        { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;
        const isEmail = validator.isEmail(email)
        if (!isEmail) {
            return {
                userErrors: [{
                    message: "Enter email with proper format"
                }],
                token: null
            }
        }
        const isValidPassword = validator.isLength(password, { min: 5 })
        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: "Enter password with length greater than 5 characters"
                }],
                token: null
            }
        }
        if (!name || !bio) {
            return {
                userErrors: [{
                    message: "namme or bio should not be empty"
                }],
                token: null
            }
        }
        const hashPassword = bcrypt.hashSync(password, 12);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            }
        })
        await prisma.profile.create({
            data: {
                bio,
                userId:user.id
            }

        })
        return {
            userErrors: [],
            token: JWT.sign({
                userId: user.id,
            }, "thisismysecret")
        }
    },
    signin: async (parent: any,
        { credentials }: SigninArgs,
        { prisma }:Context): Promise<UserPayload> => {
        const { email, password } = credentials

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return {
                userErrors: [{
                    message: "Invalid Credentials"
                }],
                token: null
            }
        }
        const isMatch = bcrypt.compareSync(password,user.password)
        if (!isMatch) {
            return {
                userErrors: [{
                    message: "Invalid Credentials"
                }],
                token: null
            }
        }
        return {
            userErrors: [],
            token:JWT.sign({
                userId: user.id,
            },"thisismysecret")
        }
    }
}
