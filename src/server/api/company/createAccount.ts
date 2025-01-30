import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import { CompanyModel } from "~/server/db/company/company";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "~/utils/nodemailer";

// Zod schema for company signup
const CompanySignupSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string()
    .regex(/^\d+$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits"),
});

export const createAccount = publicProcedure
  .input(CompanySignupSchema)
  .mutation(async ({ input }) => {
    try {
      // Check if company already exists
      const existingCompany = await CompanyModel.findByEmail(input.email);
      if (existingCompany) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Company with this email already exists"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create route name (a unique identifier for the company)
      const routeName = input.name.toLowerCase().replace(/\s+/g, '-');

      // Create new company
      const newCompany = new CompanyModel({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        routeName: routeName,
        authProvider: 'credentials',
        userRole: 'COMPANY',
        phoneNumber: input.phoneNumber,
        isVerified: false
      });

      // Save company
      const savedCompany = await newCompany.save();

      // Generate verification token (you'll need to implement this function)
      const verificationToken = generateVerificationToken(savedCompany._id);

      // Send verification email
      await sendVerificationEmail({
        to: savedCompany.email,
        name: savedCompany.name ?? "QEND-User",
        token: verificationToken
      });

      return {
        id: savedCompany._id,
        email: savedCompany.email,
        name: savedCompany.name,
        message: "Company account created. Please check your email to verify."
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Company signup error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create company account"
      });
    }
  });

// Utility function to generate verification token
function generateVerificationToken(companyId: string): string {
  // In a real implementation, use a secure random token generation method
  return `${companyId}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
}