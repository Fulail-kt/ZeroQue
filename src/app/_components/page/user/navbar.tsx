

'use client'
import React from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Search, 
  Bell,
  LogOut, 
  Home,
  Package2,
  Package
} from "lucide-react";
import { ModeToggle } from '../../global/darkMode';
import { Cart } from '~/app/_components/page/user/cart'
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import useCompanyStore from '~/store/general';
import useOrderStore, { Order } from '~/store/orderStore';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const {companyRoute}=useCompanyStore()
  const orders: Order[] = useOrderStore((state) => state.orders) ?? [];


  const handleLogout = async () => {
   await signOut({ 
      callbackUrl: '/auth/login' 
    });
  };

  return (
    <nav className="border-t z-50 md:border-b w-full fixed flex items-center px-3 h-16 md:top-0 bottom-0 bg-background">
      <div className="ml-4 hidden md:flex md:ml-0">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4 ml-8">
        <Link href={`/${companyRoute!}`}><Button variant="ghost">Home</Button></Link>
        <Button variant="ghost">Product</Button>
        <Cart />
       {orders.length>0 && <Link href={`/${companyRoute!}/orders`}><Button variant="ghost">Order</Button></Link>}
      </div>
      
      {/* Search and Actions */}
      <div className="md:ml-auto w-full md:w-fit flex justify-between items-center">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-8"
          />
        </div>
        
        {/* Mobile Search Button */}
        <Link href={`/${companyRoute!}`}>
          <Button variant="ghost" className="justify-center md:hidden">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        
        <Button variant="ghost" className="justify-center md:hidden">
          <Package className="h-5 w-5" />
        </Button>
        
        {/* Logout Button - Desktop and Mobile */}
        {session && (
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="justify-center"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
        
        {/* Use the Cart component */}
        <span className='md:hidden '>
          <Cart />
        </span>
        
        <ModeToggle/>
      </div>
    </nav>
  );
};

export default Navbar;