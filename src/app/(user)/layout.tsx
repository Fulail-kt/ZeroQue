'use client'
import "~/styles/globals.css";

// import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "~/components/theme-provider"
import Navbar from "../_components/navbar";
import Script from 'next/script'
import { TRPCReactProvider } from "~/trpc/react";
import { useEffect } from "react";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    useEffect(() => {
        // Dynamically load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }, []);

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
                        <div className="w-full md:px-16 h-full md:mt-16 md:mb-0 mb-16">{children}</div></TRPCReactProvider>
                </ThemeProvider>
            </div>
        </>
    )
}
