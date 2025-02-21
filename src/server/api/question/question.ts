// import { publicProcedure, } from "../trpc";
// import { z } from "zod";
// import { extractTextFromPDF,loadModel, answerQuestion } from "~/utils/tensorflow";



//   export const askQuestion = publicProcedure
//     .input(
//       z.object({
//         question: z.string().min(1, "Question is required"),
//       })
//     )
//     .mutation(async ({ input }) => {
//       try {
//         console.log(input,"input")
//         // Load PDF text
//         const pdfText = await extractTextFromPDF("/AI_Recruitment_QnA.pdf");

//         // Load TensorFlow.js model
//         const model = await loadModel();

//         // Get answer
//         const answers = await answerQuestion(model, pdfText, input.question);

//         return { answers };
//       } catch (error) {
//         throw new Error(`Failed to process question: ${error}`);
//       }
//     })




import { z } from "zod";
// import { extractTextFromPDF, loadModel, answerQuestion } from "~/utils/tensorflow";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const askQuestion = publicProcedure
  .input(
    z.object({
      question: z.string().min(1, "Question is required"),
    })
  )
  .mutation(async ({ input }) => {
    try {
      // Validate if file exists
      const pdfPath = "/AI_Recruitment_QnA.pdf";
      
      // Load PDF text with error handling
      let pdfText;
      try {
        // pdfText = await extractTextFromPDF(pdfPath);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }

      // Load model with error handling
      let model;
      try {
        // model = await loadModel();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }

      // Get answer with error handling
      let answers;
      try {
        // answers = await answerQuestion(model, pdfText, input.question);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get answer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }

      return { answers };
    } catch (error) {
      // Handle any other unexpected errors
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });