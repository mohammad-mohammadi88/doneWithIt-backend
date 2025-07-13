import type { Image, MyRequestHandler } from "../types/requestHandler.js";
import { deleteImage, errorHandler } from "../utils/index.js";
import { listingsStore } from "../db/index.js";
import { Listings } from "@prisma/client";

const imageDestroyer: MyRequestHandler<{ id: string }> = async (
    req,
    res,
    next
) => {
    const id = Number(req.params.id);
    const value = await listingsStore.getListingWithId(id);
    const prevListing = errorHandler<Listings>(value,res)

    const imageDelete = (prevListing.images as Image[]).map(
        async ({ public_id }) => {
            const { http_code, message: error } = await deleteImage(public_id);
            if (http_code >= 400) res.status(http_code).json({ error });
            return;
        }
    );
    if (imageDelete) await Promise.all([...imageDelete]);

    next();
};
export default imageDestroyer;
