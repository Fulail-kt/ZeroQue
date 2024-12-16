// import React from 'react';
// import { Card, CardContent, CardFooter } from "~/components/ui/card";
// import { Badge } from "~/components/ui/badge";
// import { Button } from "~/components/ui/button";
// import { Heart, Plus } from "lucide-react";
// import Link from 'next/link';
// import { Types } from 'mongoose';

// interface ProductSize {
//   name: string;
//   stock: number;
//   price: number;
// }

// interface Product {
//   _id: Types.ObjectId | string;
//   title: string;
//   description: string;
//   images: string[];
//   category: {
//     _id: string;
//     name: string;
//   };
//   subcategory?: {
//     _id: string;
//     name: string;
//   };
//   sizes: ProductSize[];
//   isDisabled?: boolean;
// }
// interface CardProps {
//   product:Product
// }

// const ProductCard = ({product}:CardProps) => {
//   return (
//     <Link href={`/${product._id}`}>
//       <Card className="w-36 md:w-72 overflow-hidden transition-all hover:shadow-lg">
//         {/* Image Container */}
//         <div className="relative h-32 md:h-48 overflow-hidden">
//           <img
//             src={product.images[0]}
//             alt={product.title}
//             className="h-full w-full object-cover transition-transform hover:scale-105"
//           />
//           <div className='absolute md:hidden !m-0 items-center w-full  text-sm text-violet-400 bottom-0 p-1 flex justify-between'>
//               <p className='!p-0 !m-0'>{product.title}</p>
//               <p className='!p-0 text-xs !m-0'>₹100</p>
//           </div>
//         </div>
//         <CardContent className="p-2 px-3 hidden md:flex">
//           {/* Title */}
//           <h3 className="font-semibold text-lg leading-tight  truncate">
//             {product.title}
//           </h3>
//         </CardContent>
//         <CardFooter className="p-4 hidden m-0 max-h-10 pt-0 md:flex items-center justify-between">
//           {/* Price */}
//           <div className="font-semibold text-lg">
//             ${product?.sizes[0].price.toFixed(2) ?? '300'}
//           </div>
      
//           {/* Add to Cart Button */}
//           <Button size="sm" className="rounded-full">
//             <Plus className="h-4 w-4 mr-2" /> Add
//           </Button>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// };

// export default ProductCard;




import React from 'react';
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import Link from 'next/link';
import { Types } from 'mongoose';

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
  price:number;
  category: Types.ObjectId | { _id: string; name: string; description?: string; subcategories?: { _id: string; name: string }[] };
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
  return (
    <Link href={`/item/${product._id}`}>
      <Card className="border-none flex justify-center md:h-56 h-48 overflow-hidden transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className='w-36 md:w-52 relative flex flex-col items-center justify-end h-full'>
          <div className="absolute top-0 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className=" md:w-44 md:h-40 size-32 rounded-xl shadow-lg dark:shadow-black/50  mt-2.5 md:mt-0 mb-5"
              height={100}
              width={100}
            />
          </div>
          <CardContent className="p-2 bg-gray-800 h-28 md:h-32 rounded-2xl w-full px-3 flex justify-between items-end">
            {/* Title */}
            <div className='flex items-center w-full justify-between'>
              <h3 className="text-[12px] tracking-wider md:text-sm  font-500 truncate w-2/3">
                {product.title}
              </h3>
              <div className="font-500 rounded-3xl flex items-center justify-center bg-gray-500 dark:bg-black/50   p-2 w-12 text-[10px] md:text-sm">
                ${product.sizes[0]?.price ?? product?.price ?? 'Na'}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;