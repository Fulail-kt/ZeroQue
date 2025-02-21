
import { askQuestion } from "../question/question";
import { createTRPCRouter } from "../trpc";

export const QaRouter=createTRPCRouter({
    askQuestion
})