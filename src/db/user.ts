import prisma, { type User, type Prisma } from "./prisma.js";
import type { RegisterUser } from "../controllers/auth.js";

class UsersStore {
    registerUser = async (data: RegisterUser): Promise<User | false> =>
        await prisma.user
            .create({
                data,
            })
            .catch(() => false);

    getUserWithEmailOrId = async (
        where: Prisma.UserWhereUniqueInput
    ): Promise<User | false | null> =>
        await prisma.user
            .findUnique({
                where,
            })
            .catch(() => false);
}

export default new UsersStore();
