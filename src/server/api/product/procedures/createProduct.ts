// import { TRPCError } from "@trpc/server";
// import mongoose from "mongoose";
// import { z } from "zod";
// import { publicProcedure } from "~/server/api/trpc";
// import { CompanyModel } from "~/server/db/company/company";
// import { ProductModel } from "~/server/db/product/";
// import { v2 as cloudinary } from "cloudinary";

// const SizeSchema = z.object({
//   name: z.string(),
//   stock: z.number().min(0),
//   price: z.number().min(0)
// });

// // Zod schema for product creation input
// const CreateProductSchema = z.object({
//   companyId:z.string().trim(),
//   title: z.string().trim(),
//   description: z.string(),
//   images: z.array(z.string().url()),
//   category: z.string().trim(),
//   subcategory:z.string().trim(),
//   sizes: z.array(SizeSchema).min(1, { message: "At least one size must be provided" })
// });

// export const createProduct = publicProcedure
//   .input(CreateProductSchema)
//   .mutation(async ({ input }) => {

//     console.log(input,"input")
//     try {


//       if (input.images) {
//         try {
//           // Upload to Cloudinary
//           const uploadResult = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
//             cloudinary.uploader.upload(
//               input.imageBase64, 
//               { 
//                 folder: "products",
//                 // Additional options like transformation
//               }, 
//               (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result!);
//               }
//             );
//           });
      
//       const newProduct = new ProductModel({
//         company:new mongoose.Types.ObjectId(input.companyId),
//         title: input.title,
//         description: input.description,
//         images: input.images,
//         category: input.category,
//         subcategory:input.subcategory,
//         sizes: input.sizes
//       });

//       console.log(newProduct, "newProduct")


//       const savedProduct = await newProduct.save();

//       return {
//         id: savedProduct._id,
//         message: "Product created successfully"
//       };
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: error.message
//         });
//       }

//       // Fallback error handling
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to create product"
//       });
//     }
//   });


import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { CompanyModel } from "~/server/db/company/company";
import { ProductModel } from "~/server/db/product/";
import { v2 as cloudinary } from "cloudinary";
import { convertBase64ToImageFile } from "~/utils/common/fileUtils";

const SizeSchema = z.object({
  name: z.string(),
  stock: z.number().min(0),
  price: z.number().min(0)
});

// Corrected Zod schema for product creation input
const CreateProductSchema = z.object({
  companyId: z.string().trim(),
  title: z.string().trim(),
  description: z.string(),
  images: z.array(z.string().url()),
  category: z.string().trim(),
  subcategory: z.string().trim().optional().nullable().transform(val => val === '' ? null : val),
  sizes: z.array(SizeSchema).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional()
}).refine(
  (data) => (data.sizes && data.sizes.length > 0) || data.price !== undefined ||data.stock !== undefined ,
  { 
    message: "Either sizes or standalone price / stock must be specified",
    path: ["price",'stock']
  }
);


export const createProduct = protectedProcedure
  .input(CreateProductSchema)
  .mutation(async ({ctx, input }) => {
    console.log(input, "input");

    if (ctx.session.user.userRole === "COMPANY") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only Companies are allowed to create job postings.",
      });
    }

    // Check if companyId or companyProfileId is present
    const companyId = ctx.session.user.companyId;
    if (!companyId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing company information: Cannot create product.",
      });
    }
    
    try {
      // Convert base64 images to uploadable files
      const uploadPromises = input.images.map(async (imageBase64) => {
        try {
          const imageFile = await convertBase64ToImageFile(imageBase64);

          cloudinary.config({
            cloud_name: 'dcbbtkrxi',
            api_key: '711576924328336',
            api_secret: 'tpjG4xLeTAaSZJBFMUQ6AfIcytw'
          });
          
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "products",
                resource_type: "image"
              }, 
              (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url);
              }
            ).end(imageFile.buffer);
          });
        } catch (conversionError) {
          console.error("Image conversion error:", conversionError);
          throw conversionError;
        }
      });

      // Wait for all image uploads to complete
      const uploadedImageUrls = await Promise.all(uploadPromises);

      const newProduct = new ProductModel({
        company: new mongoose.Types.ObjectId(input.companyId),
        title: input.title,
        description: input.description,
        images: uploadedImageUrls,
        category: input.category,
        subcategory: input.subcategory ? new mongoose.Types.ObjectId(input.subcategory) : null,
        sizes: input.sizes || [],
        price: input.sizes && input.sizes.length > 0 ? undefined : input.price,
        stock: input.sizes && input.sizes.length > 0 ? undefined : input.stock
      });

      const savedProduct = await newProduct.save();
      
      return {
        id: savedProduct._id,
        message: "Product created successfully"
      };
    } catch (error) {
      console.error("Product creation error:", error);
      
      if (error instanceof Error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message
        });
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create product"
      });
    }
  });