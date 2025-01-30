import "~/styles/globals.css";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner"
// import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "QEND",
  description: "Food Ordering app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


import { ThemeProvider } from "~/components/theme-provider"
// import Navbar from "./_components/navbar";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "~/i18n/config";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <html lang="en"  suppressHydrationWarning>
        <head />
        <body className="font-sans">
          <SessionProvider>
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <div className="">{children}</div></TRPCReactProvider>
                <Toaster />
            </ThemeProvider>
          </I18nProvider>
          </SessionProvider>
        </body>
      </html>
    </>
  )
}



