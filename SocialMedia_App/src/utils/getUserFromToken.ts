import JWT from "jsonwebtoken";

export const getUserFromToken = (token: string) => {
    try {
        return JWT.verify(token,"thisismysecret") as {
            userId:number
        };
    } catch(error) {
        console.error("Error verifying JWT token:", error);
        return null;
    }
};
