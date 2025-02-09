
import { Context } from ".."

interface canUserMutateType {
    userId: number | undefined,
    postId: number,
    prisma: Context["prisma"]
}

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
}: canUserMutateType) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        return {
            userErrors: [{
                message: "Unauthorized access"
            }],
            post: null
        }
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if (post?.authorId !== user.id) {
        return {
            userErrors: [{
                message: "Post not owned by user"
            }],
            post:null
        }
    }
}