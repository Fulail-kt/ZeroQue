import mongoose from "mongoose";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { OrderModel } from "~/server/db/order/order";

// Zod schema for order status update input
const UpdateOrderStatusSchema = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),
  companyId: z.string().trim().min(1, "Company ID is required"),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'cancelled','failed'], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value"
  })
});

export const updateOrderStatus = protectedProcedure
  .input(UpdateOrderStatusSchema)
  .mutation(async ({ input }) => {
    try {
      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(input.orderId) || 
          !mongoose.Types.ObjectId.isValid(input.companyId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid order ID or company ID"
        });
      }

      // Convert string IDs to ObjectIds
      const orderId = new mongoose.Types.ObjectId(input.orderId);
      const companyId = new mongoose.Types.ObjectId(input.companyId);

      // Build update data with timestamps based on status
      const updateData: Record<string, unknown> = {
        status: input.status
      };

      // Add appropriate timestamps based on status
      if (input.status === 'preparing') {
        updateData.preparationStartTime = new Date();
      } else if (input.status === 'ready') {
        updateData.completionTime = new Date();
      }

      // Update the order
      const updatedOrder = await OrderModel.findOneAndUpdate(
        {
          _id: orderId,
          companyId: companyId 
        },
        { $set: updateData },
        { new: true }
      );

      if (!updatedOrder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found or does not belong to the company"
        });
      }

      return {
        success: true,
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        message: "Order status updated successfully"
      };

    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update order status"
      });
    }
  });