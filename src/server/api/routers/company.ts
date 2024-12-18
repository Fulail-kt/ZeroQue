
import { checkRoute } from "../company/checkRoute";
import { createAccount } from "../company/createAccount";
import { getCompanyByEmail } from "../company/getCompanyByEmail";
import { verifyEmail } from "../company/verifyEmail";
import { createTRPCRouter } from "../trpc";

export const companyRouter=createTRPCRouter({
    createAccount,
    getCompanyByEmail,
    verifyEmail,
    checkRoute
})