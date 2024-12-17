// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//   const path = req.nextUrl.pathname;

//   // Define route patterns
//   const companyRoutes = /^\/company\/(dashboard|profile|products)/;
//   const adminRoutes = /^\/admin/;

//   // Check for company routes
//   if (companyRoutes.test(path)) {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // Ensure user has COMPANY role for company routes

//     console.log(token,"hleo")
//     if (token.userRole !== 'COMPANY') {
//       return NextResponse.redirect(new URL('/unauthorized', req.url));
//     }
//   }

//   // Check for admin routes
// //   if (adminRoutes.test(path)) {
// //     if (!token) {
// //       return NextResponse.redirect(new URL('/login', req.url));
// //     }

// //     // Ensure user has ADMIN role for admin routes
// //     if (token.userRole !== 'ADMIN') {
// //       return NextResponse.redirect(new URL('/unauthorized', req.url));
// //     }
// //   }

//   return NextResponse.next();
// }

// // Specify which routes this middleware should run on
// export const config = {
//   matcher: [
//     '/company/:path*',
//     '/admin/:path*'
//   ]
// };



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//   const path = req.nextUrl.pathname;

//   // Define dynamic route pattern for company (e.g., /[companyName]/dashboard)
//   const dynamicCompanyRoutes = /^\/([^/]+)\/(dashboard|profile|products)/;

//   const match = dynamicCompanyRoutes.exec(path);
//   if (match) {
//     const requestedCompanyName = match[1]; // Extract the dynamic company name from the path

//     if (!token) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // Ensure user has COMPANY role
//     if (token.userRole !== 'COMPANY') {
//       return NextResponse.redirect(new URL('/unauthorized', req.url));
//     }

//     // Verify if the company name in the route matches the token's companyName
//     if (token.companyName !== requestedCompanyName) {
//       return NextResponse.redirect(new URL('/unauthorized', req.url));
//     }

//     console.log(`User authorized for company: ${requestedCompanyName}`);
//   }

//   return NextResponse.next();
// }

// // Specify which routes this middleware should run on
// export const config = {
//   matcher: [
//     '/:path*/dashboard',
//     '/:path*/profile',
//     '/:path*/products',
//   ],
// };


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const path = req.nextUrl.pathname;

  console.log(token,"toekn")
  // Extract the company name from the path
  const pathSegments = path.split('/').filter(Boolean);
  const companyRoutes = ['dashboard', 'profile', 'products'];

  // Check if the path matches the company route pattern
  if (
    pathSegments.length >= 2 && 
    companyRoutes.includes(pathSegments[1]!)
  ) {
    const requestedCompanyName = pathSegments[0];

    // Validate token exists and matches the requested company
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if the token's companyName matches the route
    if (token.routeName !== requestedCompanyName) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Ensure user has COMPANY role
    if (token.userRole !== 'COMPANY') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/:companyName/(dashboard|profile|products)'
  ]
};