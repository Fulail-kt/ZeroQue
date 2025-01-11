import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import { CompanyModel } from "~/server/db/company/company";

export const checkRoute = publicProcedure
    .input(
      z.object({
        slug: z.string(),
        currentCompanyId: z.string().optional(), 
      })
    )
    .query(async ({ input }) => {
      const { slug, currentCompanyId } = input;

     
      const company = await CompanyModel.findOne({
        routeName: slug,
        ...(currentCompanyId && { _id: { $ne: currentCompanyId } })
      });

      return {
        exists: !!company,
        companyId: company?._id ?? null,
      };
    });