import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { twilioWhatsApp } from "~/server/services/twilio";

// Define the input schema using zod
const sendWhatsAppOTPSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number").max(15, "Phone number too long"),
  otp: z.string().min(4, "OTP must be at least 4 characters").max(8, "OTP must be at most 8 characters"),
});

// Define the output type
interface SendWhatsAppOTPResult {
  error(arg0: string, error: Error): unknown;
  success: boolean;
  messageId?: string; // Twilio's message ID if successful
  errorMessage?: string; // Error message if any
}

export const sendWhatsAppOTP = publicProcedure
  .input(sendWhatsAppOTPSchema) // Validate input using zod
  .mutation(async ({ input }) => {
    try {
      // Call the Twilio service
      const result = await twilioWhatsApp.sendMessage(
        input.phoneNumber,
        `Your OTP is: ${input.otp}`
      );

      // Adjust based on the actual return type
      console.log(result);

      return result
       
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);

      // return {
      //   success: false,
      //   errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
      // };
    }
  });
