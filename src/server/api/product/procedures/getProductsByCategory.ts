import { z } from 'zod';
import { publicProcedure } from '../../trpc';
import { ProductModel } from '~/server/db/product';
import CategoryModel from '~/server/db/category/category';

export const getProductsByCategory = publicProcedure
  .input(
    z.object({
      companyId: z.string(),
      limitPerCategory: z.number().default(20),
    })
  )
  .query(async ({ input }) => {
    const { companyId, limitPerCategory } = input;

    const categories = await CategoryModel.find({ company: companyId }).lean();

    const result = await Promise.all(
      categories.map(async (category) => {
        const products = await ProductModel.find({
          category: category._id,
          status: 'active',
        })
          .limit(limitPerCategory)
          .lean();
        return {
          name: category.name,
          products,
        };
      })
    );

    return { categories: result };
  });
