'use client';

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import Navbar from "../../_components/page/user/navbar";
import Script from "next/script";
import { api, TRPCReactProvider } from "~/trpc/react";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import Loading from "~/app/_components/global/loading";
import useCompanyStore from "~/store/general";

export default function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyName: string }>;
}) {
    const { companyName: slug } = use(params);
    const setCompanyData = useCompanyStore((state) => state.setCompanyData);
    
  const { data: slugCheck,isLoading,isError } = api.company.checkRoute.useQuery(
    { slug },
    { suspense: false }
  );

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  if (isError || (slugCheck && !slugCheck.exists)) {
    notFound();
  }

  useEffect(() => {
    if (slugCheck && slugCheck.exists && slugCheck.companyId) {
      setCompanyData(slugCheck.companyId, slug); 
    }
  }, [slugCheck, slug, setCompanyData]);


  if (isLoading) {
    return (
        <Loading/>
    );
  }
  

  return (
    <>
      <div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <Navbar />
            <div className="w-full md:px-16  h-full md:mt-16 md:mb-0 mb-16">
              {children}
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </div>
    </>
  );
}

