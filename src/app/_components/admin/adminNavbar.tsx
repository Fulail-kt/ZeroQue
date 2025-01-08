'use client';
import { BarChart, TimerIcon, BoxIcon, UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const AdminNavbar = () => {
    const { data: session } = useSession();
    const routeName:string = session?.user?.routeName ?? '';
  return (
    <nav className="text-white fixed w-full top-0 left-0 z-50 sm:flex sm:items-center sm:justify-between sm:px-6 sm:py-3 sm:h-auto sm:bg-transparent">

      {/* Navbar items for Desktop */}
      <div className="sm:flex sm:space-x-6 sm:items-center hidden">
        <div className="text-2xl font-semibold">Logo</div>
      </div>

      {/* Navbar links for Desktop */}
      <ul className="sm:flex sm:space-x-6 sm:items-center sm:static absolute top-0 left-0 w-full sm:w-auto bg-transparent sm:text-white sm:flex-row flex-col hidden ">
        <li className="text-center p-3 sm:p-0">
          <Link href={`/co/${routeName}/dashboard`} className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>
        <li className="text-center p-3 sm:p-0">
          <Link href={`/co/${routeName}/products`} className="hover:text-gray-300">
            Products
          </Link>
        </li>
        <li className="text-center p-3 sm:p-0">
          <Link href={`/co/${routeName}/orders`} className="hover:text-gray-300">
            Orders
          </Link>
        </li>
        <li className="text-center p-3 sm:p-0">
          <Link href={`/co/${routeName}/profile`} className="hover:text-gray-300">
            Profile
          </Link>
        </li>
      </ul>

      {/* Bottom fixed navbar for small screens with icons */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-blue-600 text-white py-2 flex justify-around items-center">
        <Link href={`/co/${routeName}/dashboard`} className="hover:text-gray-300">
          <BarChart size={24} />
        </Link>
        <Link href={`/co/${routeName}/products`} className="hover:text-gray-300">
          <TimerIcon size={24} />
        </Link>
        <Link href={`/co/${routeName}/orders`} className="hover:text-gray-300">
          <BoxIcon size={24} />
        </Link>
        <Link href={`/co/${routeName}/profile`} className="hover:text-gray-300">
          <UserIcon size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
