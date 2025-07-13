import express from "express";

import {
    getListingHandler,
    patchListingHandler,
} from "../controllers/listing.js";

const router = express.Router();

router.get("/:id", getListingHandler);
router.patch("/:id", patchListingHandler);

export default router;
