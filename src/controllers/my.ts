import type { MyRequestHandler } from "../types/requestHandler.js";
import { errorHandler } from "../utils/index.js";
import type { Listings } from "../db/prisma.js";
import { listingsStore } from "../db/index.js";
import { auth } from "../middlewares/index.js";

const myListingsCTRL: MyRequestHandler = async (req, res) => {
    const userId = req.user.userId;
    const value = await listingsStore.getUserListings(userId);
    const listings = errorHandler<Listings>(value, res);
    res.status(200).json(listings);
};
export const myListingsHandler: any[] = [auth, myListingsCTRL];
