import { z } from "zod";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { OrderModel } from "~/server/db/order/order";
import crypto from 'crypto';
import mongoose from 'mongoose';

export const verifyPayment = publicProcedure
  .input(z.object({
    orderId: z.string(), // Ensure this is a valid string representation of ObjectId
    razorpayPaymentId: z.string(),
    razorpayOrderId: z.string(),
    razorpaySignature: z.string()
  }))
  .mutation(async ({ input }) => {
    try {
      // Verify payment signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'kPJWBKuArGEh8fL76NvXFAsQ')
        .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== input.razorpaySignature) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Payment verification failed"
        });
      }

      // Validate and convert `orderId` to ObjectId
      const orderId = mongoose.Types.ObjectId.isValid(input.orderId)
        ? new mongoose.Types.ObjectId(input.orderId)
        : null;

      if (!orderId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid order ID"
        });
      }

      // Update the order
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        input.orderId,
        {
          status: 'completed',
          transactionId: input.razorpayPaymentId,
        },
        { new: true } 
      ).exec();
      

      if (!updatedOrder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found"
        });
      }

      return {
        success: true,
        orderId: updatedOrder._id
      };
    } catch (error) {
      console.error("Payment verification error:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to verify payment"
      });
    }
  });
