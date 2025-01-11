
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "~/server/api/trpc";
import { CompanyModel } from "~/server/db/company/company";

// Zod Schema for Get Company By Email
const GetCompanyByEmailSchema = z.object({
  companyId: z.string()
});

// Get Company By Email Procedure
export const getCompanyById = protectedProcedure
  .input(GetCompanyByEmailSchema)
  .query(async ({ctx, input }) => {
    try {

        if (!ctx.session?.user?.userRole || ctx.session.user.userRole !== "COMPANY") {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Only company users can update company information",
            });
        }

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
        id: company._id,
        email: company.email,
        name: company.name,
        onboarding:company.onBoarding,
        phone:company.phone,
        routeName:company.routeName,
        upiId:company.upiId,
        qrCode:company.qrCode,
        createdAt:company.createdAt,
        updatedAt:company.updatedAt,
        profile:company.profile,
        authProvider:company.authProvider,
        banners:company.banners
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