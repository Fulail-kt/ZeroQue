import { z } from "zod";
import { CompanyModel } from "~/server/db/company/company";
import { TRPCError } from "@trpc/server";
import { v2 as cloudinary } from "cloudinary";
import { convertBase64ToImageFile } from "~/utils/common/fileUtils";
import { protectedProcedure } from "../trpc";

const bannerSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(2),
    url: z.string(),
    isActive: z.boolean()
  });

const companyFormSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().min(2).optional(),
    phone: z.number().optional(),
    routeName: z.string().min(2).optional(),
    address: z.string().min(5).optional(),
    upiId: z.string().min(5).optional(),
    qrCode: z.object({
        qr: z.string(),
        url: z.string(),
        updated: z.date().optional()
      }).optional(),
    profile: z.string().optional(),
    banners: z.array(bannerSchema).optional(),
});

export const updateCompany = protectedProcedure
    .input(companyFormSchema)
    .mutation(async ({ ctx, input }) => {
        try {
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

            // Configure Cloudinary
            cloudinary.config({
                cloud_name: 'dcbbtkrxi',
                api_key: '711576924328336',
                api_secret: 'tpjG4xLeTAaSZJBFMUQ6AfIcytw'
            });

            // Find existing company to get current profile
            const existingCompany = await CompanyModel.findById(ctx.session.user.companyId);
            if (!existingCompany) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Company not found",
                });
            }

            const updateData = { ...input };

            if (input.qrCode) {
                updateData.qrCode = {
                    ...input.qrCode,
                    updated: new Date()
                };
            }

            if (input.banners) {
                const processedBanners = await Promise.all(
                  input.banners.map(async (banner) => {
                    if (banner.url && !banner.url.startsWith('http')) {
                      try {
                        const imageFile = await convertBase64ToImageFile(banner.url);
                        const uploadResult = await new Promise<string>((resolve, reject) => {
                          cloudinary.uploader.upload_stream(
                            {
                              folder: "company-banners",
                              resource_type: "image",
                              transformation: [
                                { width: 1920, height: 1080, crop: "fill" }
                              ]
                            },
                            (error, result) => {
                              if (error) reject(error as Error);
                              else resolve(result?.secure_url ?? '');
                            }
                          ).end(imageFile.buffer);
                        });
                        
                        return {
                          ...banner,
                          url: uploadResult
                        };
                      } catch (error) {
                        console.error("Banner image processing error:", error);
                        throw new TRPCError({
                          code: "INTERNAL_SERVER_ERROR",
                          message: "Failed to process banner image"
                        });
                      }
                    }
                    return banner;
                  })
                );
        
                updateData.banners = processedBanners;
              }
            // Handle profile image update if provided
            if (input.profile) {
                // Only process if it's a new image (base64 string)
                if (!input.profile.startsWith('http')) {
                    try {
                        // Convert base64 to file
                        const imageFile = await convertBase64ToImageFile(input.profile);

                        // Upload new image to Cloudinary
                        const uploadResult = await new Promise<string>((resolve, reject) => {
                            cloudinary.uploader.upload_stream(
                                {
                                    folder: "company-profiles",
                                    resource_type: "image"
                                },
                                (error, result) => {
                                    if (error) reject(error as Error);
                                    else resolve(result?.secure_url ?? '');
                                }
                            ).end(imageFile.buffer);
                        });

                        // Delete old profile image if exists
                        if (existingCompany.profile) {
                            const publicId = existingCompany.profile.split('/').pop()?.split('.')[0];
                            if (publicId) {
                                try {
                                    await cloudinary.uploader.destroy(`company-profiles/${publicId}`);
                                } catch (deleteError) {
                                    console.error("Failed to delete old profile image:", deleteError);
                                }
                            }
                        }

                        // Update the profile URL in updateData
                        updateData.profile = uploadResult;
                    } catch (error) {
                        console.error("Profile image processing error:", error);
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Failed to process profile image"
                        });
                    }
                }
            }

            // Update company with new data
            const updatedCompany = await CompanyModel.findByIdAndUpdate(
                ctx.session.user.companyId,
                updateData,
                { new: true }
            );

            if (!updatedCompany) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Company not found",
                });
            }

            return {
                id: updatedCompany._id,
                message: "Company updated successfully",
                company: updatedCompany
            };
        } catch (error) {
            console.error("Company update error:", error);

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
                message: "Failed to update company"
            });
        }
    });