import { Post } from '@prisma/client'
import { Context } from '../../index'
import { canUserMutatePost } from '../../utils/canUserMutatePost'

interface PostCreateArgs {
    post: {
        title?: string
        content?: string
    }

}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null
}
export const postResolver = {
    postCreate: async (parent: any,
        { post }: PostCreateArgs,
        { prisma, userInfo }: Context)
        : Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }
        const { title, content } = post
        if (!title || !content) {
            return {
                userErrors: [{
                    message: "Must provide title and content"
                }],
                post: null
            }
        }
        console.log(userInfo)
        return {
            userErrors: [],
            post: await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId:userInfo.userId
                }
            })
        }
    },
    postUpdate:async (parent: any,
        { post, postId }: { postId: string, post: PostCreateArgs["post"] },
        { prisma, userInfo }: Context) => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo?.userId,
            postId: Number(postId),
            prisma
        })

        if (error) return error
        const { title, content } = post

        if (!title && !content) {
            return {
                userErrors: [{
                    message: "Must provide either title or content for updation"
                }],
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
        if (!existingPost) {
            return {
                userErrors: [{
                    message: "Cannot find post for updation"
                }],
                post: null
            }
        }
        let payloadToUpdate = {
            title,
            content
        }

        return {
            userErrors: [],
            post: prisma.post.update({ //does not need await in return
                data: {
                    ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
    postDelete: async (parent: any,
        { postId }: { postId: string },
        { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo?.userId,
            postId: Number(postId),
            prisma
        })

        if (error) return error
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!post) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist",
                    },
                ],
                post: null,
            };
        }
        await prisma.post.delete({
            where: {
                id: Number(postId),
            },
        });

        return {
            userErrors:[],
            post,
        };
    },

    postPublish: async (parent: any,
        { postId }:{ postId:string},
        { prisma, userInfo}: Context,):Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({
            userId: userInfo?.userId,
            postId: Number(postId),
            prisma
        })
        if (error) return error

        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
        if (!post) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist",
                    },
                ],
                post: null,
            };
        }
        
        await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                published:true
            }
        });
        return {
            userErrors: [],
            post,
        };
    },
    postUnpublish: async (parent: any,
        { postId }: { postId: string },
        { prisma, userInfo }: Context,): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({
            userId: userInfo?.userId,
            postId: Number(postId),
            prisma
        })

        if (error) return error
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!post) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist",
                    },
                ],
                post: null,
            };
        }
        await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                published:false
            }
        });

        return {
            userErrors: [],
            post,
        };
    }
}