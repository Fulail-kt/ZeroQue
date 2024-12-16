import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc"; 
import { CompanyModel } from "~/server/db/company/company";

const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const verifyEmail = publicProcedure
  .input(VerifyEmailSchema)
  .mutation(async ({ input }) => {
    try {
      const [companyId] = input.token.split('-');

      const company = await CompanyModel.findByIdAndUpdate(
        companyId, 
        { 
          isVerified: true,
          createdAt: new Date() 
        },
        { new: true }
      );

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid verification token",
        });
      }

      return {
        success: true,
        message: "Email verified successfully",
        email: company.email,
      };
    } catch (error) {
      console.error("Email verification error:", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Email verification failed",
      });
    }
  });