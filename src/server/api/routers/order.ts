
import { checkPendingOrders } from "../order/checkPending";
import { createOrder } from "../order/createOrder";
import { getOrders } from "../order/getAllOrders";
import { updateOrderStatus } from "../order/updateOrderStatus";
import { checkPaymentStatus } from "../order/verify";
import { verifyUpiPayment } from "../order/verifyPayment";
import { createTRPCRouter } from "../trpc";

export const orderRouter=createTRPCRouter({
    createOrder,
    verifyUpiPayment,
    checkPaymentStatus,
    checkPendingOrders,
    getOrders,
    updateOrderStatus
})