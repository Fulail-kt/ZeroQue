import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import CategoryModel from "~/server/db/category/category"; // Adjust the import path as needed

// Zod schema for subcategory input
const SubcategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().trim().min(1, "Subcategory name is required"),
  description: z.string().optional()
});

// Zod schema for category creation input
const CreateCategorySchema = z.object({
  companyId: z.string().trim(),
  name: z.string().trim().min(1, "Category name is required"),
  description: z.string().optional(),
  subcategories: z.array(SubcategorySchema).optional(),
  isActive: z.boolean().optional().default(true)
});


// Create Category Procedure
export const createCategory = publicProcedure
  .input(CreateCategorySchema)
  .mutation(async ({ input }) => {
    try {
        console.log("Input:", input);
      const newCategory = new CategoryModel({
        company: new mongoose.Types.ObjectId(input.companyId),
        name: input.name,
        description: input.description,
        subcategories: input.subcategories ?? [],
        isActive: input.isActive ?? true
      });

      const savedCategory = await newCategory.save();

      return {
        id: savedCategory._id,
        message: "Category created successfully"
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create category"
      });
    }
  });

// Update Category Procedure
