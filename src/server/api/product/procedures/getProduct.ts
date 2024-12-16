import { z } from 'zod';
import { protectedProcedure, publicProcedure } from '../../trpc';
import { ProductModel } from '~/server/db/product';
import { TRPCError } from '@trpc/server';

export const getProduct = publicProcedure
  .input(
    z.object({
      productId: z.string(),
    })
  )
  .query(async ({ctx, input }) => {
    const { productId } = input;

    

    const product = await ProductModel.findById(productId)
      .populate({
        path: 'company',
        select: 'name',
      })
      .populate({
        path: 'category',
        select: 'name description subcategories',
      })
      .lean();

    if (!product) {
      throw new Error('Product not found');
    }

    // Ensure subcategory is properly attached
    if (
      product.category &&
      typeof product.category === 'object' &&
      'subcategories' in product.category &&
      Array.isArray(product.category.subcategories) &&
      product.subcategory
    ) {
      const subcategory = product.category.subcategories.find(
        (sub) => sub._id.toString() === product.subcategory?.toString()
      );

      if (subcategory) {
        Object.assign(product, { subcategory });
      }
    }

    const productWithIdsAsStrings = {
        ...product,
        _id: product._id.toString(),
        sizes: product.sizes?.map((size) => ({
          ...size,
          _id: size._id ? size._id.toString() : undefined, 
        })),
      };
      

    return productWithIdsAsStrings;
  });
