import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { CompanyModel } from "~/server/db/company/company";
import { TRPCError } from "@trpc/server";

const companyFormSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    phone: z.number(),
    routeName: z.string().min(2),
    address: z.string().min(5),
    upiId:z.string().min(5),
    onBoarding: z.boolean(),
});

export const updateOnboarding = protectedProcedure
    .input(companyFormSchema)
    .mutation(async ({ ctx, input }) => {

        console.log(input,"inpu")
        // Check if user exists and has the correct role
        if (!ctx.session?.user?.userRole || ctx.session.user.userRole !== "COMPANY") {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Only company users can update company information",
            });
        }

        // Verify the company ID exists
        if (!ctx.session.user.companyId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Company ID is required",
            });
        }

        const updatedCompany = await CompanyModel.findByIdAndUpdate(
            ctx.session.user.companyId,
            {
                ...input,
                onBoarding: true,
            },
            { new: true }
        );

        if (!updatedCompany) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Company not found",
            });
        }

        return updatedCompany;
    });