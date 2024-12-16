
import { createOrder } from "../order/createOrder";
import { verifyPayment } from "../order/verifyPayment";
import { createTRPCRouter } from "../trpc";

export const orderRouter=createTRPCRouter({
    createOrder,
    verifyPayment
})