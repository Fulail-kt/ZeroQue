import React from 'react';
import { BarLoader } from 'react-spinners';
import Image from 'next/image';

const Loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-black ">
        {/* Logo */}
        <div className='hidden dark:block'>
          <Image 
            alt="OQ-logo" 
            width={40} 
            height={40} 
            className='animate-pulse'
            src="/assets/0-q-x.png" 
            priority // Ensures faster loading for critical images
          />
        </div>
        <div className=' dark:hidden'>
          <Image 
            alt="OQ-logo" 
            width={40} 
            height={40} 
            className='animate-pulse'
            src="/assets/0q-d-rm" 
            priority // Ensures faster loading for critical images
          />
        </div>
      
        {/* Loading Indicator */}
        <div className=" hidden dark:flex items-center justify-center space-x-2">
          {/* Dark mode loader */}
          <BarLoader className="" color="white" />
      
          {/* Light mode loader */}
        </div>
        <div className="flex dark:hidden items-center justify-center space-x-2">
          <BarLoader  />
        </div>
      </div>
      
    );
};

export default Loading;