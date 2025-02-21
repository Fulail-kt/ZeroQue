// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { twilioWhatsApp } from "~/server/services/twilio";

// // Define the input schema using zod
// const sendWhatsAppOTPSchema = z.object({
//   phoneNumber: z.string().min(10, "Invalid phone number").max(15, "Phone number too long"),
//   otp: z.string().min(4, "OTP must be at least 4 characters").max(8, "OTP must be at most 8 characters"),
// });

// // Define the output type
// interface SendWhatsAppOTPResult {
//   error(arg0: string, error: Error): unknown;
//   success: boolean;
//   messageId?: string; // Twilio's message ID if successful
//   errorMessage?: string; // Error message if any
// }

// export const sendWhatsAppOTP = publicProcedure
//   .input(sendWhatsAppOTPSchema) // Validate input using zod
//   .mutation(async ({ input }) => {
//     try {
//       // Call the Twilio service
//       const result = await twilioWhatsApp.sendMessage(
//         input.phoneNumber,
//         `Your OTP is: ${input.otp}`
//       );

//       // Adjust based on the actual return type
//       console.log(result);

//       return result
       
//     } catch (error) {
//       console.error("Error sending WhatsApp message:", error);

//       // return {
//       //   success: false,
//       //   errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
//       // };
//     }
//   });


// import { NlpManager } from "node-nlp";
// import { publicProcedure } from "../trpc";
// import {z} from 'zod'

// const qnaData={
//   "faqs": [
//     {
//       "question": "What is your refund policy?",
//       "answer": "We offer a 30-day money-back guarantee. Contact support for details."
//     },
//     {
//       "question": "How do I reset my password?",
//       "answer": "You can reset your password by visiting the 'Forgot Password' page."
//     },
//     {
//       "question": "What are your support hours?",
//       "answer": "Our support team is available from 9 AM to 6 PM, Monday to Friday."
//     },
//     {
//       "question": "How do I contact support?",
//       "answer": "You can reach us at support@myapp.com or call us at +1-800-123-4567."
//     }
//   ],
//   "fallback": [
//     "I'm sorry, I didn't understand that. Could you rephrase your question?",
//     "I'm not sure about that. Can you provide more details?",
//     "Let me check that for you. Could you clarify your question?"
//   ]
// }

// // Initialize NLP.js
// const manager = new NlpManager({ languages: ["en"] });

// // Train the NLP model with QnA data
// qnaData.faqs.forEach((faq) => {
//   manager.addDocument("en", faq.question, faq.question); // Use question as intent
//   manager.addAnswer("en", faq.question, faq.answer); // Map intent to answer
// });

// // Train the model
// (async () => {
//   await manager.train();
//   manager.save();
// })();


//   export const getBotResponse= publicProcedure
//     .input(z.string())
//     .mutation(async ({ input }) => {
//       // Process the user's message
//       console.log(input)
//       const response = await manager.process("en", input);

//       // If no match, return a random fallback message
//       if (response.intent === "None") {
//         const randomFallback =
//           qnaData.fallback[Math.floor(Math.random() * qnaData.fallback.length)];
//         return { response: randomFallback };
//       }

//       // Return the matched answer
//       return { response: response.answer };
//     })





// import { publicProcedure } from "../trpc";
// import { z } from "zod";
// import { manager, qnaData } from "~/utils/nlp"; 

// export const getBotResponse = publicProcedure
//   .input(z.string())
//   .mutation(async ({ input }) => {
//     console.log("User asked:", input);

//     try {
//       // Process the user's message
//       const response = await manager.process("en", input);
//       console.log("NLP response:", JSON.stringify(response, null, 2));

//       // If no intent was matched or confidence is low
//       if (response.intent === "None" || response.score < 0.5) {
//         const randomFallback =
//           qnaData.fallback[Math.floor(Math.random() * qnaData.fallback.length)];
//         return { response: randomFallback };
//       }

//       // Find the matching FAQ
//       const matchedFaq = qnaData.faqs.find(faq => faq.question === response.intent);
      
//       if (matchedFaq && Array.isArray(matchedFaq.answers) && matchedFaq.answers.length > 0) {
//         // Get a random answer from the matched FAQ
//         const randomIndex = Math.floor(Math.random() * matchedFaq.answers.length);
//         return { response: matchedFaq.answers[randomIndex] };
//       }
      
//       // Fallback if structure doesn't match
//       return { response: "I couldn't find an answer to that question." };
//     } catch (error) {
//       console.error("Error processing message:", error);
//       return { response: "Sorry, I encountered an error processing your request." };
//     }
//   });

import { publicProcedure } from "../trpc";
import { z } from "zod";
import { manager, qnaData } from "~/utils/nlp";

// Define types for the NLP response
interface NLPResponse {
  intent: string;
  score: number;
  // Add other properties if needed
}

// Define types for FAQ data
interface FAQ {
  question: string;
  answers: string[];
}

interface QNAData {
  fallback: string[];
  faqs: FAQ[];
}

// Type assertion for imported data
const typedManager = manager as {
  process: (language: string, text: string) => Promise<NLPResponse>;
};
const typedQnaData = qnaData as QNAData;

export const getBotResponse = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    console.log("User asked:", input);
    try {
      // Process the user's message with proper typing
      const response: NLPResponse = await typedManager.process("en", input);
      console.log("NLP response:", JSON.stringify(response, null, 2));

      // If no intent was matched or confidence is low
      if (response.intent === "None" || response.score < 0.5) {
        const randomFallback =
          typedQnaData.fallback[Math.floor(Math.random() * typedQnaData.fallback.length)];
        return { response: randomFallback };
      }

      // Find the matching FAQ
      const matchedFaq = typedQnaData.faqs.find(
        (faq) => faq.question === response.intent
      );

      if ((matchedFaq?.answers ?? []).length > 0) {
        // Get a random answer from the matched FAQ
        const randomIndex = Math.floor(Math.random() * (matchedFaq?.answers?.length ?? 0));
        return { response: matchedFaq?.answers[randomIndex] };
      }

      // Fallback if structure doesn't match
      return { response: "I couldn't find an answer to that question." };
    } catch (error) {
      console.error("Error processing message:", error);
      return { response: "Sorry, I encountered an error processing your request." };
    }
  });