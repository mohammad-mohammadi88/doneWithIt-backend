import { v2 as cloudinary } from "cloudinary";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import prisma from "./db/prisma.js";
import {
    authRouter,
    categoriesRouter,
    listingRouter,
    listingsRouter,
    messagesRouter,
    myRouter,
    userRouter,
    usersRouter,
} from "./routes/index.js";

async function main() {
    // connect to database
    await prisma.$connect();
    console.log("✅ Prisma connected");

    // cloudinary config
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        api_key: process.env.CLOUDINARY_API_KEY,
    });

    const app = express();

    // middlewares
    app.use(express.json());
    app.use(express.urlencoded());

    // routes
    app.use("/auth", authRouter);
    app.use("/categories", categoriesRouter);
    app.use("/listing", listingRouter);
    app.use("/listings", listingsRouter);
    app.use("/messages", messagesRouter);
    app.use("/my",myRouter)
    app.use("/user", userRouter)
    app.use("/users", usersRouter);

    // server start
    app.listen(9000, "0.0.0.0", () => console.log("Server is ready"));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
