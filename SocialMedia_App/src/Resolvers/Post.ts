import { Context } from ".."
import { userLoader } from "../loaders/userLoader"

interface ProfileParentType {
    authorId: number
}

export const Post = {
    user: (parent: ProfileParentType,
        args: any,
        { prisma, userInfo }: Context) => {
        return userLoader.load(parent.authorId)
    },

}