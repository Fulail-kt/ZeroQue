import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { publicProcedure } from "~/server/api/trpc";
import { ProductModel } from "~/server/db/product/";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

export const deleteProduct = publicProcedure
  .input(z.object({
    productId: z.string().trim(),
  }))
  .mutation(async ({ input }) => {
    try {
      const { productId } = input;

      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid product ID",
        });
      }

      // Find the product
      const product = await ProductModel.findById(productId);

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: "dcbbtkrxi",
        api_key: "711576924328336",
        api_secret: "tpjG4xLeTAaSZJBFMUQ6AfIcytw",
      });

      // Delete images from Cloudinary
      const deletePromises = product.images.map(async (imageUrl) => {
        // Extract public ID from the Cloudinary URL
        const publicId = imageUrl.split("/").pop()?.split(".")[0];

        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (error) {
            console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
          }
        }
      });

      await Promise.all(deletePromises);

      // Delete the product from the database
      await ProductModel.findByIdAndDelete(productId);

      return {
        message: "Product deleted successfully",
      };
    } catch (error) {
      console.error("Product deletion error:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete product",
      });
    }
  });
