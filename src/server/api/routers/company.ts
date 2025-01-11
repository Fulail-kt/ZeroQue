
import { checkRoute } from "../company/checkRoute";
import { createAccount } from "../company/createAccount";
import { getBanners } from "../company/getBanners";
import { getCompanyByEmail } from "../company/getCompanyByEmail";
import { getCompanyById } from "../company/getCompanyById";
import { updateCompany } from "../company/updateCompany";
import { updateOnboarding } from "../company/updateOnboarding";
import { verifyEmail } from "../company/verifyEmail";
import { createTRPCRouter } from "../trpc";

export const companyRouter=createTRPCRouter({
    createAccount,
    getCompanyByEmail,
    verifyEmail,
    checkRoute,
    getCompanyById,
    updateOnboarding,
    updateCompany,
    getBanners
})