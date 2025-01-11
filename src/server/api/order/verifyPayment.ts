

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { OrderModel } from "~/server/db/order/order";
import { PaymentStore } from '~/lib/redis';
import { EventEmitter } from 'events';

// Payment event emitter
const paymentEvents = new EventEmitter();

export const verifyUpiPayment = publicProcedure
  .input(z.object({
    orderId: z.string(),
    refNumber: z.string(),
    upiTransactionId: z.string(),
    status: z.enum(['SUCCESS', 'FAILURE', 'PENDING']),
    errorMessage: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    try {
      const order = await OrderModel.findById(input.orderId);
      
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found"
        });
      }

      // Update payment status in Redis
      const currentStatus = await PaymentStore.getPaymentStatus(input.refNumber);
      if (currentStatus) {
        const attempts = await PaymentStore.updatePaymentAttempts(input.refNumber);
        currentStatus.attempts = attempts;
        currentStatus.lastUpdated = new Date();
      }

      // Handle payment status
      switch (input.status) {
        case 'SUCCESS':
          order.payment.status = 'completed';
          order.payment.transactionId = input.upiTransactionId;
          order.lastPaymentAttempt = new Date();
          paymentEvents.emit(`payment_success_${input.refNumber}`, {
            orderId: order._id,
            transactionId: input.upiTransactionId
          });
          break;

        case 'FAILURE':
          order.payment.status = 'failed';
          order.lastPaymentAttempt = new Date();
          order.paymentAttempts = (order.paymentAttempts || 0) + 1;
          order.lastError = input.errorMessage;
          paymentEvents.emit(`payment_failure_${input.refNumber}`, {
            orderId: order._id,
            error: input.errorMessage
          });
          break;

        case 'PENDING':
          order.paymentAttempts = (order.paymentAttempts || 0) + 1;
          order.lastPaymentAttempt = new Date();
          break;
      }

      await order.save();

      // Clean up Redis payment status after completion
      if (input.status !== 'PENDING') {
        await PaymentStore.deletePaymentStatus(input.refNumber);
      }

      return {
        success: input.status === 'SUCCESS',
        order: {
          id: order._id,
          status: order.status,
          attempts: order.paymentAttempts,
          lastAttempt: order.lastPaymentAttempt
        }
      };
    } catch (error) {
      console.error("UPI verification error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to verify UPI payment"
      });
    }
  });