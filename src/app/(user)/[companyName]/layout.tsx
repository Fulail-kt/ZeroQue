// 'use client'
// import "~/styles/globals.css";

// // import { GeistSans } from "geist/font/sans";

// import { ThemeProvider } from "~/components/theme-provider"
// import Navbar from "../../_components/navbar";
// import Script from 'next/script'
// import { api, TRPCReactProvider } from "~/trpc/react";
// import { useEffect } from "react";
// import { notFound } from "next/navigation";

// export default function RootLayout({ children,params }: Readonly<{ children: React.ReactNode,params:{companyName:string} }>) {
//     const slug=params?.companyName

//  const { data: slugCheck, isLoading } = api.company.checkRoute.useQuery(
//         { slug },
//         { suspense: false } 
//       );

//     useEffect(() => {
//         // Dynamically load Razorpay script
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         document.body.appendChild(script);
//       }, []);

//       if (!isLoading && slugCheck && !slugCheck.exists) {
//         notFound(); // Uses Next.js 14's built-in 404 handling
//       }
    
//     return (
//         <>
//             <div>
//                 <ThemeProvider
//                     attribute="class"
//                     defaultTheme="system"
//                     enableSystem
//                     disableTransitionOnChange
//                 >
//                     <TRPCReactProvider>
//                         <Navbar />
//                         <div className="w-full md:px-16 h-full md:mt-16 md:mb-0 mb-16">{children}</div></TRPCReactProvider>
//                 </ThemeProvider>
//             </div>
//         </>
//     )
// }


// 'use client';

// import "~/styles/globals.css";
// import { ThemeProvider } from "~/components/theme-provider";
// import Navbar from "../../_components/navbar";
// import Script from "next/script";
// import { api, TRPCReactProvider } from "~/trpc/react";
// import { useEffect } from "react";
// import { notFound } from "next/navigation";
// import { use } from "react";

// export default function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ companyName: string }>;
// }) {
//   const { companyName: slug } = use(params);

//   // Use the slug to check the route with tRPC
//   const { data: slugCheck, isLoading } = api.company.checkRoute.useQuery(
//     { slug },
//     { suspense: false }
//   );

//   useEffect(() => {
//     // Dynamically load Razorpay script
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   // Redirect to 404 if slug doesn't exist
//   if (!isLoading && slugCheck && !slugCheck.exists) {
//     notFound();
//   }

//   return (
//     <>
//       <div>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <TRPCReactProvider>
//             <Navbar />
//             <div className="w-full md:px-16 h-full md:mt-16 md:mb-0 mb-16">
//               {children}
//             </div>
//           </TRPCReactProvider>
//         </ThemeProvider>
//       </div>
//     </>
//   );
// }


'use client';

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import Navbar from "../../_components/navbar";
import Script from "next/script";
import { api, TRPCReactProvider } from "~/trpc/react";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyName: string }>;
}) {
  const { companyName: slug } = use(params);

  // Use the slug to check the route with tRPC (with suspense enabled)
  const { data: slugCheck,isLoading } = api.company.checkRoute.useQuery(
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

  // Redirect to 404 if slug doesn't exist
  if (slugCheck && !slugCheck.exists) {
    notFound();
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
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
            <div className="w-full md:px-16 h-full md:mt-16 md:mb-0 mb-16">
              {children}
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </div>
    </>
  );
}

