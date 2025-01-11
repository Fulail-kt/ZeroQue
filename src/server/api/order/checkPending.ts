import { z } from "zod";
import { publicProcedure } from "../trpc";
import { OrderModel } from "~/server/db/order/order";

export const checkPendingOrders = publicProcedure
  .input(
    z.object({
      companyId: z.string(),
      itemIds: z.array(z.string()),
      email:z.string(),
      date: z.string(), 
    })
  )
  .mutation(async ({ input }) => {
    const { companyId, itemIds } = input;

    // Find pending orders with UPI payment details
    const pendingOrder = await OrderModel.findOne({
      companyId,
      status: "pending",
      "payment.method": "upi", // Only look for UPI payments
      "payment.status": "pending",
      items: {
        $elemMatch: {
          id: { $in: itemIds },
        },
      },
      createdAt: {
        $gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
      },
    });

    // Return the result with payment details
    return {
      hasPendingOrder: !!pendingOrder,
      pendingOrder: pendingOrder
        ? {
            orderId: pendingOrder._id.toString(),
            upiUrl: pendingOrder.payment?.upiUrl,
            qrCode: pendingOrder.payment?.qrCode,
            refNumber: pendingOrder.payment?.refNumber,
            expiresAt: pendingOrder.payment?.expiresAt,
          }
        : null,
    };
  });
