import "express";
import type { NextFunction, Request, Response } from "express";

import type { Listings } from "../db/prisma.js";

export interface User {
    userId: number;
    name: string;
    email: string;
}
export type Image = Record<"url" | "public_id", any>;

declare module "express-serve-static-core" {
    interface Request {
        files?: Express.Multer.File[];
        user: User;
        images?: Image[];
        listing?: Listings;
    }
}

export type MyRequestHandler<
    Params = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
    Locals extends Record<string, any> = Record<string, any>
> = (
    req: Request<
        Params,
        { error: string } | ResBody,
        ReqBody,
        ReqQuery,
        Locals
    >,
    res: Response<{ error: string } | ResBody>,
    next: NextFunction
) => any;
