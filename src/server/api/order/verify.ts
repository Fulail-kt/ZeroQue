// import { z } from "zod";
// import { publicProcedure } from "../trpc";
// import { TRPCError } from "@trpc/server";
// import { OrderModel } from "~/server/db/order/order";


// // Payment status tracking interface
// interface PaymentStatus {
//     status: 'pending' | 'completed' | 'failed';
//     lastUpdated: Date;
//     attempts: number;
//     error?: string;
//   }
  
//   // Payment status map
//   const paymentStatusMap = new Map<string, PaymentStatus>();

// export const checkPaymentStatus = publicProcedure
//   .input(z.object({
//     refNumber: z.string(),
//     orderId: z.string()
//   }))
//   .mutation(async ({ input }) => {
//     const status = paymentStatusMap.get(input.refNumber);
//     if (!status) {
//       throw new TRPCError({
//         code: "NOT_FOUND",
//         message: "Payment status not found"
//       });
//     }

//     const order = await OrderModel.findById(input.orderId);
//     if (!order) {
//       throw new TRPCError({
//         code: "NOT_FOUND",
//         message: "Order not found"
//       });
//     }

//     return {
//       status: status.status,
//       lastUpdated: status.lastUpdated,
//       attempts: status.attempts,
//       orderStatus: order.status,
//       error: status.error
//     };
//   });



import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { OrderModel } from "~/server/db/order/order";
import { PaymentStore } from '~/lib/redis';

export const checkPaymentStatus = publicProcedure
  .input(z.object({
    refNumber: z.string(),
    orderId: z.string()
  }))
  .mutation(async ({ input }) => {

    console.log("input", input);
    const status = await PaymentStore.getPaymentStatus(input.refNumber);
    if (!status) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Payment status not found"
      });
    }

    const order = await OrderModel.findById(input.orderId);
    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found"
      });
    }

    return {
      status: status.status,
      lastUpdated: status.lastUpdated,
      attempts: status.attempts,
      orderStatus: order.status,
      error: status.error
    };
  });