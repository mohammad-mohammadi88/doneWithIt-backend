import sharp from "sharp";

import type { Image, MyRequestHandler } from "../types/requestHandler.js";
import { uploadToCloudinary } from "../utils/index.js";

const imageResize: MyRequestHandler = async (req, res, next) => {
    if (!req?.files?.length)
        return res
            .status(400)
            .json({ error: "please send at least one image" });

    const images: Image[] = [];
    const resizePromises = req?.files?.map(async (file) => {
        const processedImage = await sharp(file.buffer)
            .resize(2000)
            .jpeg({ quality: 50 })
            .toBuffer();
        const { secure_url: url, public_id } = await uploadToCloudinary(
            processedImage
        );
        images.push({ url, public_id });
    });

    if (resizePromises) await Promise.all([...resizePromises]);

    if (images.length === 0)
        return res.status(500).json({
            error: "unexpected error happend while saving your images",
        });

    req.images = images;

    next();
};
export default imageResize;
