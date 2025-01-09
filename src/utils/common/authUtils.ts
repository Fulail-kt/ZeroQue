

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export async function requireAuth(requiredRole?: 'COMPANY' | 'ADMIN') {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (requiredRole && session.user.userRole !== requiredRole) {
    redirect('/unauthorized');
  }

  return session;
}

// Use in your server components like this:
// export default async function CompanyDashboard() {
//   const session = await requireAuth('COMPANY');
//   return <div>Company Dashboard</div>;
// }