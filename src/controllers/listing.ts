import type { MyRequestHandler } from "../types/requestHandler.js";
import { auth, canIChangeListing } from "../middlewares/index.js";
import { errorHandler } from "../utils/index.js";
import type { Listings } from "../db/prisma.js";
import { listingsStore } from "../db/index.js";

export const getListingHandler: MyRequestHandler<
    { id: string },
    Listings
> = async (req, res) => {
    const id = Number(req.params.id);
    const value = await listingsStore.getListingWithId(id);
    const listing = errorHandler<Listings>(
        value,
        res,
        "any listing with this id"
    );

    res.status(200).json(listing);
};

const patchListingCTRL: MyRequestHandler<{ id: string }> = async (req, res) => {
    const id = Number(req.params.id);
    const isSold = !req.listing?.isSold;
    const result = await listingsStore.editListing(id, { isSold });
    const listing = errorHandler<Listings>(result, res);
    res.status(200).json(listing);
};
export const patchListingHandler = [auth, canIChangeListing, patchListingCTRL];
