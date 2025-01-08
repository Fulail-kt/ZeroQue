import React from 'react';
import { Card, CardContent } from "~/components/ui/card";
import Link from 'next/link';
import { Types } from 'mongoose';
import useCompanyStore from '~/store/general';

interface ProductSize {
  name: string;
  stock: number;
  price: number;
}

interface Product {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category: Types.ObjectId | { 
    _id: string; 
    name: string; 
    description?: string; 
    subcategories?: { _id: string; name: string }[] 
  };
  subcategory?: {
    _id: string;
    name: string;
  };
  sizes: ProductSize[];
  isDisabled?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { companyRoute } = useCompanyStore();
  
  // Convert ObjectId to string if needed
  const productId = typeof product._id === 'string' ? product._id : product._id.toString();
  
  // Handle null company route with a default or show nothing
  if (!companyRoute) {
    return null; // Or return a fallback UI component
  }

  // Calculate the price safely
  const displayPrice = product.sizes[0]?.price ?? product.price ?? 'N/A';

  return (
    <Link href={`/${companyRoute}/item/${productId}`}>
      <Card className="border-none flex justify-center md:h-56 h-48 overflow-hidden transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className='w-36 md:w-52 relative flex flex-col items-center justify-end h-full'>
          <div className="absolute top-0 overflow-hidden">
            <img
              src={product.images[0] || '/placeholder-image.jpg'} // Add fallback image
              alt={product.title}
              className="md:w-44 md:h-40 size-32 rounded-xl shadow-lg dark:shadow-black/50 mt-2.5 md:mt-0 mb-5"
              height={100}
              width={100}
            />
          </div>
          <CardContent className="p-2 bg-gray-800 h-28 md:h-32 rounded-2xl w-full px-3 flex justify-between items-end">
            {/* Title */}
            <div className='flex items-center w-full justify-between'>
              <h3 className="text-[12px] tracking-wider md:text-sm font-500 truncate w-2/3">
                {product.title}
              </h3>
              <div className="font-500 rounded-3xl flex items-center justify-center bg-gray-500 dark:bg-black/50 p-2 w-12 text-[10px] md:text-sm">
                ${displayPrice}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;