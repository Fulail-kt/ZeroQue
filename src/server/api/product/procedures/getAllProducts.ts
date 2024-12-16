import { z } from 'zod';
import { publicProcedure } from '../../trpc';
import { CompanyModel } from '~/server/db/company/company';
import { ProductModel } from '~/server/db/product';
import CategoryModel from '~/server/db/category/category';

export const getProducts = publicProcedure
  .input(
    z.object({
      companyId: z.string(),
      page: z.number().min(1).default(1),
      pageSize: z.number().default(6),
      search: z.string().optional(),
      status:z.string().optional().default('active')
    })
  )
  .query(async ({ input }) => {
    const { companyId, page,pageSize, search } = input;
    const skip = (page - 1) * pageSize;

    // Ensure Company model is registered
    await CompanyModel.init();

    const query: any = { company: companyId, status: input.status };

if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  // For searching categories, you might need a different approach
  // This depends on how your references are set up
  try {
    // If category is a reference, you might need to do a separate lookup
    const categoryIds = await CategoryModel.find({
      name: { $regex: search, $options: 'i' }
    }).select('_id');

    if (categoryIds.length > 0) {
      query.$or.push({ category: { $in: categoryIds.map(cat => cat._id) } });
    }
  } catch (error) {
    console.error('Category search error:', error);
  }
}

    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

    // const products = await ProductModel.find(query)
    //   .skip(skip)
    //   .limit(pageSize)
    //   .populate('company','category','category.subcategories').sort({ createdAt: -1 })
    //   .lean();

    const products = await ProductModel.find(query)
  .skip(skip)
  .limit(pageSize)
  .populate({
    path: 'company',
    select: 'name',
  })
  .populate({
    path: 'category',
    select: 'name description subcategories', // Include subcategories here
  })
  .sort({ createdAt: -1 })
  .lean();

  products.forEach((product) => {
    try {
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
        
        // Only modify if a matching subcategory is found
        if (subcategory) {
          Object.assign(product, { subcategory });
        }
      }
    } catch (error) {
      console.error('Error processing product subcategory:', error);
      // Optionally set to null or handle the error
    }
  });

    return {
      products,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalProducts
      }
    };
  });