
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
    '/(dashboard|profile|products)'
  ]
};


