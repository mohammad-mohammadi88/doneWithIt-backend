import prisma, { type Message } from "./prisma.js";

class MessagesStore {
    getMessages = async (toUserId: number): Promise<Message[] | false> =>
        await prisma.message
            .findMany({
                where: { toUserId },
                orderBy: {
                    createdAt: "desc",
                },
            })
            .catch(() => false);

    getMessageWithId = async (id: number): Promise<Message | false | null> =>
        await prisma.message.findUnique({ where: { id } }).catch(() => false);

    postMessage = async (
        data: Omit<Message, "id" | "createdAt">
    ): Promise<Message | false> =>
        await prisma.message.create({ data }).catch(() => false);

    deleteMessage = async (id: number): Promise<Message | false> =>
        await prisma.message.delete({ where: { id } }).catch(() => false);
}

export default new MessagesStore();
