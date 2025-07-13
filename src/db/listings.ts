import type { listingInfo } from "../controllers/listings.js";
import type { Image } from "../types/requestHandler.js";
import prisma, { type Listings } from "./prisma.js";

class ListingsStore {
    getListings = async (
        perPage?: number,
        page?: number
    ): Promise<Listings[] | false> => {
        const options: any = {
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    isSold: "asc",
                },
            ],
        };
        if (perPage) {
            options.take = perPage;
            if (page) options.skip = perPage * (page - 1);
        }

        return await prisma.listings.findMany(options).catch(() => false);
    };

    getListingWithId = async (id: number): Promise<Listings | null | false> =>
        await prisma.listings.findUnique({ where: { id } }).catch(() => false);

    getUserListings = async (userId: number): Promise<Listings[] | false> =>
        await prisma.listings
            .findMany({
                where: { userId },
            })
            .catch(() => false);

    getUserListingsCount = async (userId: number): Promise<number | false> =>
        await prisma.listings
            .count({
                where: { userId },
            })
            .catch(() => false);

    isListingForUser = async (
        listingId: number,
        userId: number
    ): Promise<Listings | null | false> =>
        await prisma.listings
            .findUnique({
                where: {
                    id: listingId,
                    userId,
                },
            })
            .catch(() => false);

    postListing = async (
        data: listingInfo & { userId: number; images: Image[] }
    ): Promise<Listings | false> =>
        await prisma.listings
            .create({
                data,
            })
            .catch(() => false);

    deleteLisitng = async (id: number) =>
        await prisma.listings
            .delete({
                where: { id },
            })
            .catch(() => false);

    editListing = async (
        id: number,
        data: Partial<listingInfo & { images: Image[]; isSold: boolean }>
    ): Promise<Listings | false> =>
        await prisma.listings
            .update({
                data,
                where: { id },
            })
            .catch(() => false);
}

export default new ListingsStore();
