import { z } from 'zod';
import { Types } from 'mongoose';
import { publicProcedure } from '../../trpc';
import { CompanyModel } from '~/server/db/company/company';
import { ProductModel } from '~/server/db/product';
import CategoryModel from '~/server/db/category/category';

// Refined interfaces with more precise typing
interface ICompany {
  _id: Types.ObjectId;
  name: string;
}

interface ISubcategory {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICategory {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  subcategories?: ISubcategory[];
}

interface IProduct {
  _id: Types.ObjectId;
  title: string;
  description: string;
  company: ICompany;
  category?: ICategory;
  subcategory?: Types.ObjectId | ISubcategory | null;
  status: string;
  createdAt: Date;
}

// Input validation schema
const ProductQuerySchema = z.object({
  companyId: z.string(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(6),
  search: z.string().optional(),
  status: z.string().optional().default('active')
});

export const getProducts = publicProcedure
  .input(ProductQuerySchema)
  .query(async ({ input }) => {
    const { companyId, page, pageSize, search, status } = input;
    const skip = (page - 1) * pageSize;

    // Ensure Company model is initialized
    await CompanyModel.init();

    // Construct dynamic query
    const query: Record<string, unknown> = { 
      company: companyId, 
      status 
    };

    // Advanced search with error handling
    if (search) {
      const searchQuery: Array<Record<string, unknown>> = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];

      try {
        // Perform category search safely
        const categoryIds = await CategoryModel.find({
          name: { $regex: search, $options: 'i' }
        }).select('_id').lean();

        if (categoryIds.length > 0) {
          searchQuery.push({ 
            category: { $in: categoryIds.map(cat => cat._id) } 
          });
        }

        // Use $or if multiple search conditions exist
        if (searchQuery.length > 1) {
          query.$or = searchQuery;
        }
      } catch (error) {
        console.error('Category search error:', error);
      }
    }

    // Perform parallel queries for better performance
    const [totalProducts, products] = await Promise.all([
      ProductModel.countDocuments(query),
      ProductModel.find(query)
        .skip(skip)
        .limit(pageSize)
        .populate<{ company: ICompany }>({
          path: 'company',
          select: 'name',
        })
        .populate<{ category: ICategory }>({
          path: 'category',
          select: 'name description subcategories',
        })
        .sort({ createdAt: -1 })
        .lean()
    ]);

    // Enhanced subcategory matching with safe typing
    const processedProducts = products.map(product => {
      const processedProduct = { ...product };
      
      if (
        product?.category?.subcategories?.length &&
        product?.subcategory
      ) {
        // Safely extract subcategory ID
        const subcategoryId = 
          product.subcategory && typeof product.subcategory === 'object' && '_id' in product.subcategory
            ? product.subcategory._id.toString()
            : product.subcategory;
    
        const subcategory = product.category.subcategories.find(
          sub => sub._id.toString() === subcategoryId
        );
    
        if (subcategory) {
          processedProduct.subcategory = subcategory;
        }
      }
    
      return processedProduct;
    });
    

    

    // Calculate pagination details
    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
      products: processedProducts,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalProducts
      }
    };
  });