import type { MyRequestHandler } from "../types/requestHandler.js";
import { errorHandler } from "../utils/index.js";
import { listingsStore } from "../db/index.js";
import type { Listings } from "@prisma/client";

const canIChangeListing: MyRequestHandler<{ id: string }> = async (
    req,
    res,
    next
) => {
    const id = Number(req.params.id);
    const value = await listingsStore.isListingForUser(
        id,
        req.user.userId ?? 1
    );
    const listing = errorHandler<Listings>(
        value,
        res,
        "listing with given id and userId"
    );
    req.listing = listing;
    next();
};
export default canIChangeListing;
