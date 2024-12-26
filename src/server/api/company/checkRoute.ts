import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import { CompanyModel } from "~/server/db/company/company";

export const checkRoute = publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { slug } = input;

      const company = await CompanyModel.findOne({routeName: slug})

      return {
        exists: !!company,
        companyId: company?._id ?? null,
      };
    })

