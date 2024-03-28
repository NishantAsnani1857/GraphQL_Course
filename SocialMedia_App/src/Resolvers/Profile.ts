import { Context } from "..";

interface ProfileParentType {
    id: number;
    bio: string;
    userId: number;
}

export const Profile = {
    user: (parent: ProfileParentType, args: any, { prisma, userInfo }: Context) => {
        console.log(parent);
        return prisma.user.findUnique({
            where: {
                id: parent.userId
            }
        });
    }
};
