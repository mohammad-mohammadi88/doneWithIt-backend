import express from "express";

import {
    deleteListingHandler,
    getListingsHandler,
    postListingHandler,
    putListingHandler,
} from "../controllers/listings.js";

const router = express.Router();

router.get("/", getListingsHandler);
router.post("/", postListingHandler);
router.put("/:id", putListingHandler);
router.delete("/:id", deleteListingHandler);

export default router;
