
import { sendWhatsAppOTP } from "../sendMessage/sendMessag";
import { createTRPCRouter } from "../trpc";

export const messageRouter=createTRPCRouter({
    sendWhatsAppOTP
})