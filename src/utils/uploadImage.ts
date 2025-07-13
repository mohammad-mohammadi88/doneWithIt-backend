import multer, { memoryStorage } from "multer";
import streamifier from "streamifier";
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from "cloudinary";

const uploadToCloudinary = async (
    buffer: Buffer
): Promise<UploadApiResponse | UploadApiErrorResponse> =>
    await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "listings" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        
        streamifier.createReadStream(buffer).pipe(stream);
    });
export default uploadToCloudinary;

export const upload = multer({ storage: memoryStorage() });