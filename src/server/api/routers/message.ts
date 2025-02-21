import { getBotResponse } from "../sendMessage/sendMessag";
import { createTRPCRouter } from "../trpc";

export const messageRouter=createTRPCRouter({
    getBotResponse
})