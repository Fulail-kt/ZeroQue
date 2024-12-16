import mongoose from "mongoose";
import CategoryModel from "~/server/db/category/category";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const SubcategorySchema = z.object({
    _id: z.string().optional(),
    name: z.string().trim().min(1, "Subcategory name is required"),
    description: z.string().optional()
  });
  
  // Zod schema for category update input
  const UpdateCategorySchema = z.object({
    _id: z.string().trim(),
    companyId: z.string().trim().optional(),
    name: z.string().trim().optional(),
    description: z.string().optional(),
    subcategories: z.array(SubcategorySchema).optional(),
    isActive: z.boolean().optional()
  });
  

export const updateCategory = publicProcedure
  .input(UpdateCategorySchema)
  .mutation(async ({ input }) => {
    try {
        console.log("Input:", input)
      // Validate category ID
      if (!mongoose.Types.ObjectId.isValid(input._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid category ID"
        });
      }

      // Build the update object
      const updateData: Record<string, any> = {};

      if (input.companyId) {
        updateData.company = new mongoose.Types.ObjectId(input.companyId);
      }
      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.subcategories) updateData.subcategories = input.subcategories;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      // Update the category
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        input._id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found"
        });
      }

      return {
        id: updatedCategory._id,
        message: "Category updated successfully"
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
        message: "Failed to update category"
      });
    }
  });

