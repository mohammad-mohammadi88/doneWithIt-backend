import express from "express";
import {
    deleteMessageHandler,
    getMessagesHandler,
    postMessageHandler,
} from "../controllers/messages.js";

const router = express.Router();

router.get("/", getMessagesHandler);
router.post("/", postMessageHandler);
router.delete("/:id", deleteMessageHandler);

export default router;
