import Joi from "joi";

import { listingsStore, messagesStore, usersStore } from "../db/index.js";
import type { MyRequestHandler } from "../types/requestHandler.js";
import { auth, validationSchema } from "../middlewares/index.js";
import type { Listings, Message, User } from "../db/prisma.js";
import { errorHandler } from "../utils/index.js";

interface ResponseMessage {
    content: string;
    createdAt: Date;
    fromUser: Omit<User, "password"> | null;
    fromUserId: number;
    id: number;
    listingId: number | null;
    toUserId: number;
}
// get messages
const getMessagesCTRL: MyRequestHandler<null, ResponseMessage[]> = async (
    req,
    res
) => {
    const value = await messagesStore.getMessages(req?.user?.userId ?? 1);
    const messages = errorHandler<Message[]>(value, res);

    const mapUser = async (
        userId: number
    ): Promise<Omit<User, "password"> | void> => {
        const value1 = await usersStore.getUserWithEmailOrId({ id: userId });
        const user = errorHandler<User>(value1, res, "user with given userId");

        const { email, id, name } = user;
        return { email, id, name };
    };
    const result: Promise<ResponseMessage>[] = messages.map(
        async (message) => ({
            ...message,
            fromUser: (await mapUser(message.fromUserId)) ?? null,
        })
    );
    const responseMessages = await Promise.all([...result]);
    return res.status(200).json(responseMessages);
};
export const getMessagesHandler: any[] = [auth, getMessagesCTRL];

// post message

const schema = Joi.object({
    content: Joi.string().required().label("Message"),
    listingId: Joi.number().optional(),
    userId: Joi.number().optional(),
});
const messageCreator: MyRequestHandler<
    null,
    null,
    { content: string; listingId?: number; userId?: number }
> = async (req, res, next) => {
    let { content, listingId, userId } = req.body;
    if (listingId) {
        listingId = Number(listingId);
        const value = await listingsStore.getListingWithId(listingId);
        const listing = errorHandler<Listings>(
            value,
            res,
            "listing with this id"
        );
        req.message = {
            content,
            fromUserId: req.user?.userId ?? 1,
            toUserId: listing.userId,
            listingId,
        };
    } else if (userId && !listingId) {
        const id = Number(userId);
        const value = await usersStore.getUserWithEmailOrId({ id });
        errorHandler<User>(value, res, "user with this id");
        req.message = {
            content,
            toUserId: id,
            fromUserId: req.user.userId ?? 1,
            listingId: null,
        };
    } else
        return res
            .status(400)
            .json({ error: "please send either userId or listingId" });

    next();
};
const postMessageCTRL: MyRequestHandler<null, Message> = async (req, res) => {
    if (!req.message) return;

    const newMessage = req.message;
    const messageValue = await messagesStore.postMessage(newMessage);
    const message = errorHandler<Message>(messageValue, res);

    res.status(201).json(message);
};
export const postMessageHandler: any[] = [
    auth,
    validationSchema(schema),
    messageCreator,
    postMessageCTRL,
];

// delete message
const deleteMessageCTRL: MyRequestHandler<{ id: string }> = async (
    req,
    res
) => {
    const id = Number(req.params.id);

    const value = await messagesStore.deleteMessage(id);
    const message = errorHandler<Message>(value, res);

    res.status(200).json(message);
};
const canIDeleteMessage: MyRequestHandler<{ id: string }> = async (
    req,
    res,
    next
) => {
    const messageId = Number(req.params.id);
    const value = await messagesStore.getMessageWithId(messageId);
    const { toUserId } = errorHandler<Message>(
        value,
        res,
        "message with given id"
    );

    if (toUserId !== req.user?.userId)
        return res
            .status(403)
            .json({ error: "you can not delete others message" });

    next();
};
export const deleteMessageHandler: any[] = [
    auth,
    canIDeleteMessage,
    deleteMessageCTRL,
];
