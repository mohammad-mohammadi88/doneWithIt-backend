import Joi from "joi";

import { listingsStore, messagesStore, usersStore } from "../db/index.js";
import type { MyRequestHandler } from "../types/requestHandler.js";
import { auth, validationSchema } from "../middlewares/index.js";
import type { Listings, Message, User } from "../db/prisma.js";
import { errorHandler } from "../utils/index.js";

interface ResponseMessage {
    content: string;
    createdAt: Date;
    fromUserId: Omit<User, "password"> | number;
    id: number;
    listingId: number;
    toUserId: Omit<User, "password"> | number;
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
            fromUserId:
                (await mapUser(message.fromUserId)) ?? message.fromUserId,
        })
    );
    const responseMessages = await Promise.all([...result]);
    return res.status(200).json(responseMessages);
};
export const getMessagesHandler: any[] = [auth, getMessagesCTRL];

// post message

const schema = Joi.object({
    content: Joi.string().required().label("Message"),
    listingId: Joi.number().required(),
});
const postMessageCTRL: MyRequestHandler<
    null,
    Message,
    { content: string; listingId: number }
> = async (req, res) => {
    let { content, listingId } = req.body;
    listingId = Number(listingId);
    const value = await listingsStore.getListingWithId(listingId);
    const listing = errorHandler<Listings>(value, res, "listing with this id");

    const newMessage = {
        content,
        fromUserId: req.user?.userId ?? 1,
        toUserId: listing.userId,
        listingId,
    };
    const value1 = await messagesStore.postMessage(newMessage);
    const message = errorHandler<Message>(value1, res);

    res.status(201).json(message);
};
export const postMessageHandler: any[] = [
    auth,
    validationSchema(schema),
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
