import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import { ProductModel } from "~/server/db/product/";
import { v2 as cloudinary } from "cloudinary";
import { convertBase64ToImageFile } from "~/utils/common/fileUtils";

const SizeSchema = z.object({
  name: z.string(),
  stock: z.number().min(0),
  price: z.number().min(0)
});

const UpdateProductSchema = z.object({
  productId: z.string().trim(),
  companyId: z.string().trim().optional(),
  title: z.string().trim().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().toLowerCase().trim().optional(),
  subcategory: z.string().toLowerCase().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  sizes: z.array(SizeSchema).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional()
}).refine(
  (data) => (data.sizes && data.sizes.length > 0) ?? data.price !== undefined ?? data.stock!==undefined,
  { 
    message: "Either sizes or standalone price / stock must be specified",
    path: ["price"]
  }
);


export const updateProduct = publicProcedure
  .input(UpdateProductSchema)
  .mutation(async ({ input }) => {
    try {
      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(input.productId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid product ID"
        });
      }

      // Find the existing product
      const existingProduct = await ProductModel.findById(input.productId);

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: 'dcbbtkrxi',
        api_key: '711576924328336',
        api_secret: 'tpjG4xLeTAaSZJBFMUQ6AfIcytw'
      });

      type ProductUpdateFields = {
        company?: mongoose.Types.ObjectId;
        title?: string;
        description?: string;
        images?: string[];
        category?: string;
        subcategory?: string;
        sizes?: z.infer<typeof SizeSchema>[];
        status?: "active" | "inactive";
        price?: number;
        stock?: number;
      };

      const updateData: ProductUpdateFields = {};
      const currentImages = existingProduct?.images || [];

      // Handle image uploads and deletions
      let uploadedImageUrls: string[] = [];
      if (input.images && input.images.length > 0) {
        // Upload new images
        const uploadPromises = input.images.map(async (imageInput): Promise<string> => {
          // Check if it's already a URL or a base64 image
          if (imageInput.startsWith('http')) {
            return imageInput; // Already a URL, return as is
          }

          try {
            const imageFile = await convertBase64ToImageFile(imageInput);
            
            return new Promise<string>((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                  folder: "products",
                  resource_type: "image"
                }, 
                (error, result) => {
                  if (error) reject(error as Error);
                  else resolve(result?.secure_url ?? '');
                }
              ).end(imageFile.buffer);
            });
          } catch (conversionError) {
            console.error("Image conversion error:", conversionError);
            throw conversionError;
          }
        });

        uploadedImageUrls = await Promise.all(uploadPromises);

        // Delete old images from Cloudinary
        const deletePromises = currentImages.map(async (imageUrl) => {
          // Extract the public ID from the Cloudinary URL
          const publicId = imageUrl.split('/').pop()?.split('.')[0];
          
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (deleteError) {
              console.error(`Failed to delete image ${publicId}:`, deleteError);
            }
          }
        });

        await Promise.all(deletePromises);
      }

      console.log(input,"inp")
      // Populate update data
      if (input.companyId) {
        updateData.company = new mongoose.Types.ObjectId(input.companyId);
      }
      if (input.title) updateData.title = input.title;
      if (input.description) updateData.description = input.description;
      if (uploadedImageUrls.length > 0) updateData.images = uploadedImageUrls;
      if (input.category) updateData.category = input.category;
      if (input.subcategory) updateData.subcategory = input.subcategory;
      if (input.sizes) updateData.sizes = input.sizes;
      if (input.status) updateData.status = input.status;
      if(input.price) updateData.price = input.price;
      if(input.stock) updateData.stock = input.stock;

      // Update the product
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        input.productId,
        { $set: updateData },
        { new: true }
      );

      if (!updatedProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }

      return {
        id: updatedProduct._id,
        message: "Product updated successfully"
      };
    } catch (error) {
      console.error("Product update error:", error);
      
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
        message: "Failed to update product"
      });
    }
  });