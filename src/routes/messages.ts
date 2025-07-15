import express from "express";
import {
    deleteMessageHandler,
    getMessageHandler,
    getMessagesHandler,
    postMessageHandler,
} from "../controllers/messages.js";

const router = express.Router();

router.get("/", getMessagesHandler);
router.get("/:id",getMessageHandler)
router.post("/", postMessageHandler);
router.delete("/:id", deleteMessageHandler);

export default router;
