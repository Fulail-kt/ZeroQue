
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { CompanyModel } from "~/server/db/company/company";

// Zod Schema for Get Company By Email
const GetCompanyByEmailSchema = z.object({
  companyId: z.string()
});

// Get Company By Email Procedure
export const getBanners = publicProcedure
  .input(GetCompanyByEmailSchema)
  .query(async ({ input }) => {
    try {
      // Find company by email
      const company = await CompanyModel.findById(input.companyId);
      
      // If no company found, throw a not found error
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found with the provided id"
        });
      }

      // Return company details (exclude sensitive information)
      return {
        banners:company?.banners?.filter((banner)=>banner.isActive)??[]
      };
    } catch (error) {
      // Handle different types of errors
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
        message: "Failed to retrieve company"
      });
    }
  });