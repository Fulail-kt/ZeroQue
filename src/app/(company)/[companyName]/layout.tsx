import "~/styles/globals.css";

// import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";


// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en" className={`${GeistSans.variable}`}>
//       <body>
//         <TRPCReactProvider>{children}</TRPCReactProvider>
//       </body>
//     </html>
//   );
// }


import { ThemeProvider } from "~/components/theme-provider"
import {SessionProvider} from "next-auth/react";
import Navbar from "~/app/_components/navbar";
import { requireAuth } from "~/utils/common/authUtils";

export default async function CompanyLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await requireAuth('COMPANY');
  
  return (
    <>
      <div>

          <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
                  {/* <Navbar/> */}
                  <div className="w-full md:px-16 h-full md:mt-16 md:mb-0 mb-16">{children}</div>
              </TRPCReactProvider>
          </ThemeProvider>
              </SessionProvider>
      </div>
      
    </>
  )
}
