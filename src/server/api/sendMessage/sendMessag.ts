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