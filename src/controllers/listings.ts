import Joi from "joi";

import type { Image, MyRequestHandler } from "../types/requestHandler.js";
import { categoriesStore, listingsStore } from "../db/index.js";
import { maxImageCount } from "../config/defaults.js";
import { upload } from "../utils/uploadImage.js";
import { errorHandler } from "../utils/index.js";
import type { Listings } from "../db/prisma.js";
import {
    auth,
    canIChangeListing,
    imageDestroyer,
    imageResize,
    validationSchema,
} from "../middlewares/index.js";

// schema
const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    price: Joi.number().required().min(1),
    categoryId: Joi.number().required().min(1),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
});

// get listings
export const getListingsHandler: MyRequestHandler<
    never,
    Listings[],
    never,
    { per_page?: string; page?: string }
> = async (req, res) => {
    const value = await listingsStore.getListings(
        Number(req.query.per_page),
        Number(req.query.page)
    );
    const listings = errorHandler<Listings[]>(value, res);
    res.status(200).json(listings);
};

// create listing
export interface listingInfo {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    latitude?: number | null;
    longitude?: number | null;
}
const postListingCTRL: MyRequestHandler<never, Listings, listingInfo> = async (
    req,
    res
) => {
    const categoryId = Number(req.body.categoryId);
    const categories = categoriesStore.getCategories();
    if (!categories.some(({ id }) => categoryId === id))
        return res.status(400).json({ error: "This category id is not valid" });
    const body: listingInfo = {
        ...req.body,
        price: Number(req.body.price),
        categoryId,
        latitude: Number(req.body?.latitude) ?? null,
        longitude: Number(req.body?.longitude) ?? null,
    };

    body.description = body?.description?.trim();
    body.title = body.title.trim();

    const value = await listingsStore.postListing({
        ...body,
        userId: req?.user?.userId ?? 1,
        // we will always have image if not it will return the response in imageResize middleware
        images: req.images ?? [],
    });
    const listing = errorHandler<Listings>(value, res);

    res.status(201).json(listing);
};
export const postListingHandler: any[] = [
    upload.array("images", maxImageCount),
    validationSchema(schema),
    auth,
    imageResize,
    postListingCTRL,
];

// update listing
const putListingCTRL: MyRequestHandler<
    { id: string },
    Listings,
    listingInfo
> = async (req, res) => {
    const id = Number(req.params.id);
    const value = await listingsStore.getListingWithId(id);
    errorHandler(value, res, "listing with given id");

    const data: Partial<listingInfo & { images: Image[] }> = {
        ...req.body,
        price: Number(req.body.price),
        latitude: Number(req.body?.latitude) ?? null,
        longitude: Number(req.body?.longitude) ?? null,
        categoryId: Number(req.body.categoryId),
    };
    if (req.images) data.images = req.images;

    const result = await listingsStore.editListing(id, data);
    const listing = errorHandler<Listings>(result, res);
    res.status(200).json(listing);
};
export const putListingHandler: any[] = [
    upload.array("images", maxImageCount),
    validationSchema(schema),
    auth,
    canIChangeListing,
    imageDestroyer,
    imageResize,
    putListingCTRL,
];

// delete lisitng
const deleteListingCTRL: MyRequestHandler<{ id: string }> = async (
    req,
    res
) => {
    const id = Number(req.params.id);
    const value = await listingsStore.getListingWithId(id);
    errorHandler(value, res, "listing with given id");

    const result = await listingsStore.deleteLisitng(id);
    const listing = errorHandler(result,res)
    res.status(200).send(listing);
};
export const deleteListingHandler: any[] = [
    auth,
    canIChangeListing,
    imageDestroyer,
    deleteListingCTRL,
];
