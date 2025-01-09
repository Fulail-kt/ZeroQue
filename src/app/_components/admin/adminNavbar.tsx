'use client';
import React from 'react';
import { Button } from "~/components/ui/button";
import { 
  LayoutDashboard,
  Package2,
  ShoppingCart,
  UserCircle
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminNavbar = () => {
  const { data: session } = useSession();
  const routeName = session?.user?.routeName ?? '';
  const pathName = usePathname();
  const isActive = (path: string) => pathName === path;

  return (
    <nav className="border-t z-50 md:border-b w-full fixed flex items-center px-3 h-16 md:top-0 bottom-0 bg-background">
      <div className="max-w-7xl w-full mx-auto flex items-center">
        <div className="ml-4 hidden md:flex md:ml-0">
          <h1 className="text-xl font-bold">Logo</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 ml-8">
          <Link href={`/co/${routeName}/dashboard`}>
            <Button
              variant="ghost"
              className={isActive(`/co/${routeName}/dashboard`) ? 'text-primary' : ''}
            >
              Dashboard
            </Button>
          </Link>
          <Link href={`/co/${routeName}/products`}>
            <Button
              variant="ghost"
              className={isActive(`/co/${routeName}/products`) ? 'text-primary' : ''}
            >
              Products
            </Button>
          </Link>
          <Link href={`/co/${routeName}/orders`}>
            <Button
              variant="ghost"
              className={isActive(`/co/${routeName}/orders`) ? 'text-primary' : ''}
            >
              Orders
            </Button>
          </Link>
        </div>

        {/* Actions Section */}
        <div className="md:ml-auto w-full md:w-fit flex justify-between items-center">
          {/* Mobile Navigation */}
          <Link href={`/co/${routeName}/dashboard`}>
            <Button
              variant="ghost"
              className={`justify-center md:hidden ${
                isActive(`/co/${routeName}/dashboard`) ? 'bg-primary' : ''
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/co/${routeName}/products`}>
            <Button
              variant="ghost"
              className={`justify-center md:hidden ${
                isActive(`/co/${routeName}/products`) ? 'bg-primary' : ''
              }`}
            >
              <Package2 className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/co/${routeName}/orders`}>
            <Button
              variant="ghost"
              className={`justify-center md:hidden ${
                isActive(`/co/${routeName}/orders`) ? 'bg-primary' : ''
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/co/${routeName}/profile`}>
            <Button
              variant="ghost"
              className={`justify-center ${
                isActive(`/co/${routeName}/profile`) ? 'text-primary md:text-white md:bg-primary' : ''
              }`}
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
