// Get Categories Procedure

import { z } from "zod";
import { publicProcedure } from "../../trpc";
import CategoryModel,{ ICategory } from "~/server/db/category/category";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";

export const getCategories = publicProcedure
  .input(
    z.object({
      companyId: z.string().trim(),
      active: z.boolean().optional()
    }).optional()
  )
  .query(async ({ input }) => {
    try {
      const filter: Record<string, unknown> = {};

      // Add company filter if companyId is provided
      if (input?.companyId) {
        filter.company = new mongoose.Types.ObjectId(input.companyId);
      }

      // Add active filter if specified
      if (input?.active !== undefined) {
        filter.isActive = input.active;
      }

      const categories:ICategory[] = await CategoryModel.find(filter);

      return {
        categories,
        count: categories.length
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
        message: "Failed to retrieve categories"
      });
    }
  });

// // Optional: Get Single Category Procedure
// export const getCategoryById = publicProcedure
//   .input(
//     z.object({
//       categoryId: z.string().trim()
//     })
//   )
//   .query(async ({ input }) => {
//     try {
//       // Validate category ID
//       if (!mongoose.Types.ObjectId.isValid(input.categoryId)) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "Invalid category ID"
//         });
//       }

//       const category = await CategoryModel.findById(input.categoryId);

//       if (!category) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Category not found"
//         });
//       }

//       return category;
//     } catch (error) {
//       if (error instanceof TRPCError) {
//         throw error;
//       }

//       if (error instanceof Error) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: error.message
//         });
//       }

//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to retrieve category"
//       });
//     }
//   });