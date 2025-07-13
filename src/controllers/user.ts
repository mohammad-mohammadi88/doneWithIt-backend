import type { MyRequestHandler } from "../types/requestHandler.js";
import { listingsStore, usersStore } from "../db/index.js";
import { errorHandler } from "../utils/index.js";
import type { User } from "../db/prisma.js";

const getUserCTRL: MyRequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id);
    const { email, name } = req?.user;
    const value = await listingsStore.getUserListingsCount(id);
    const listings = errorHandler<number>(value,res);

    const response = {
        id,
        name,
        email,
        listings,
    };
    res.status(200).json(response);
};
const validateUser: MyRequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);
    const value = await usersStore.getUserWithEmailOrId({ id });
    const user = errorHandler<User>(value,res,"user with given id")

    const { id: userId, name, email } = user;
    req.user = { userId, name, email };
    next();
};
export const getUserHandler: any[] = [validateUser, getUserCTRL];
