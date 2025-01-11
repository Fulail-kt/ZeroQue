import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider"
import { SessionProvider } from "next-auth/react";
import AdminNavbar from "~/app/_components/admin/adminNavbar";
import { requireAuth } from "~/utils/common/authUtils";
import OnboardingModal from "~/app/_components/global/onBoardingModal";

export default async function CompanyLayout({ 
  children 
}: Readonly<{ 
  children: React.ReactNode 
}>) {
  const session = await requireAuth('COMPANY');
  const needsOnboarding = !session?.user?.onBoarding;

  return (
    <div>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <AdminNavbar />
            <div className="w-full mt-14 flex justify-center h-full">
              {children}
            </div>
            {needsOnboarding && <OnboardingModal />}
          </TRPCReactProvider>
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
}