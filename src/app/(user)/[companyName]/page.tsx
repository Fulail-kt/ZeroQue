// 'use client'
// import Head from 'next/head'
// import React, { use, useEffect, useState } from 'react'
// import Navbar from '../../_components/navbar'
// import ProductCard from '../../_components/card'
// import { Button } from '~/components/ui/button'
// import Category from '../../_components/category'
// import { Search } from 'lucide-react'
// import { Input } from '~/components/ui/input'
// import { api } from '~/trpc/react'
// import { ICategory, ISubcategory } from '~/server/db/category/category'
// import { Types } from 'mongoose'
// import useCompanyStore from '~/store/general'

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
//   price:number;
//   stock: number;
//   category: Types.ObjectId | { _id: string; name: string; description?: string; subcategories?: { _id: string; name: string }[] };
//   subcategory?: {
//     _id: string;
//     name: string;
//   };
//   sizes: ProductSize[];
//   isDisabled?: boolean;
// }

// const Page = () => {
//   const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
//   const { companyId } = useCompanyStore();
//   const { data: productsData, isLoading } = api.product.getProducts.useQuery({
//     companyId:companyId as string,
//     page: 1,
//     pageSize: 10,
//     search: selectedCategory?.name ?? '',
//     status: "active"
//   },{
//     enabled: !!companyId && typeof companyId === "string",
//   });

//   const { data: productsByCategory, isLoading: productsByCategoryLoading } = api.product.getProductsByCategory.useQuery({
//     companyId:companyId as string ,
//     limitPerCategory: 20,
//   },{
//     enabled: !!companyId && typeof companyId === "string",
//   });

//   const filterProductsBySubcategory = (subcategoryId: string) => {
//     return productsData?.products.filter(product => 
//       product.subcategory?._id.toString() === subcategoryId
//     ) ?? [];
//   };

//   return (
//     <>
//       <Head>
//         <title>Free Choice | Home</title>
//       </Head>
//       <nav className='md:hidden items-center  justify-between px-4 flex h-16 fixed top-0'>
//         <div className="ml-4 flex">
//           <h1 className="text-xl font-bold">Logo</h1>
//         </div>
//         <div className="items-center relative">
//           <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search..."
//             className="w-64 pl-8"
//           />
//         </div>
//       </nav>
//       <div className='px-5'>
//         <div className='mt-16'>
//           <Category
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />
//         </div>

//         {selectedCategory && (
//           <div>
//             {selectedCategory.subcategories.length > 0 ? (
//               <>
//                 {selectedCategory.subcategories.map((subCategory: ISubcategory, index: number) => {
//                   const subcategoryProducts = filterProductsBySubcategory(subCategory._id.toString());
                  
//                   return (
//                     subcategoryProducts.length > 0 && (
//                       <div key={subCategory._id.toString() + index}>
//                         <div className='w-full flex md:p-2 justify-between items-center'>
//                           <h1>{subCategory?.name}</h1>
//                           <Button className='bg-transparent text-primary hover:underline hover:bg-transparent pr-0'>View more</Button>
//                         </div>
//                         <div className='grid scrollbar-none grid-flow-col-dense overflow-y-auto gap-1 md:gap-4 w-full'>
//                           {subcategoryProducts.map((product, index) => (
//                             <ProductCard 
//                               key={product?._id as string ?? index} 
//                               product={product as unknown as Product}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     )
//                   );
//                 })}
//               </>
//             ) : (
//               <div className='grid scrollbar-none grid-cols-2 gap-1 sm:grid-cols-3 place-items-center md:grid-cols-3 '>
//                 {productsData?.products?.map((product, index) => (
//                   <ProductCard 
//                     key={(product._id as string) + index} 
//                     product={product as unknown as Product} 
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {!selectedCategory && (
//           <div>
//             {productsByCategory?.categories
//               .filter((category) => category.products.length > 0)
//               .map((category) => (
//                 <div key={category.name}>
//                   <div className="flex justify-between items-center py-2">
//                     <h1 className="text-lg font-semibold">{category.name}</h1>
//                     <Button className="bg-transparent text-primary hover:underline hover:bg-transparent">
//                       View more
//                     </Button>
//                   </div>
//                   <div className="grid grid-flow-col-dense overflow-x-auto gap-4 scrollbar-none">
//                     {category.products.map((product,index) => (
//                       <ProductCard key={product._id as string ?? index} product={product as unknown as Product} />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default Page;


'use client';

import Head from 'next/head';
import React, { useState } from 'react';
import ProductCard from '../../_components/card';
import { Button } from '~/components/ui/button';
import Category from '../../_components/category';
import { Search } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';
import { ICategoryDTO, type ICategory, type ISubcategory } from '~/server/db/category/category';
import type { Types } from 'mongoose';
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
  stock: number;
  category: Types.ObjectId | {
    _id: string;
    name: string;
    description?: string;
    subcategories?: { _id: string; name: string }[];
  };
  subcategory?: {
    _id: string;
    name: string;
  };
  sizes: ProductSize[];
  isDisabled?: boolean;
}

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<ICategory |null>(null);
  const { companyId } = useCompanyStore();

  const { data: productsData } = api.product.getProducts.useQuery(
    {
      companyId: companyId!,
      page: 1,
      pageSize: 10,
      search: selectedCategory?.name === "All" ? "" : selectedCategory?.name ?? '',
      status: "active",
    },
    {
      enabled: !!companyId,
    }
  );
  
  const { data: productsByCategory } = api.product.getProductsByCategory.useQuery({
    companyId: companyId!,
    limitPerCategory: 20,
  }, {
    enabled: !!companyId,
  });


  console.log(productsByCategory,"categor")

  const filterProductsBySubcategory = (subcategoryId: string) => {
    return productsData?.products.filter(product =>
      product.subcategory?._id.toString() === subcategoryId
    ) ?? [];
  };


  return (
    <>
      <Head>
        <title>Free Choice | Home</title>
      </Head>
      <nav className='md:hidden items-center justify-between px-4 flex h-16 fixed top-0'>
        <div className="ml-4 flex">
          <h1 className="text-xl font-bold">Logo</h1>
        </div>
        <div className="items-center relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-8"
          />
        </div>
      </nav>
      <div className='px-5'>
        <div className='mt-16'>
          <Category
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {selectedCategory && (
          <div>
            {selectedCategory.subcategories.length > 0 ? (
              <>
                {selectedCategory.subcategories.map((subCategory: ISubcategory, index: number) => {
                  const subcategoryProducts = filterProductsBySubcategory(subCategory._id.toString())

                  return (
                    subcategoryProducts.length > 0 && (
                      <div key={subCategory._id.toString() + index}>
                        <div className='w-full flex md:p-2 justify-between items-center'>
                          <h1>{subCategory?.name}</h1>
                          <Button className='bg-transparent text-primary hover:underline hover:bg-transparent pr-0'>View more</Button>
                        </div>
                        <div className='grid scrollbar-none grid-flow-col-dense overflow-y-auto gap-1 md:gap-4 w-full'>
                          {subcategoryProducts.map((product, index) => (
                            <ProductCard
                              key={product?._id as string ?? index}
                              product={product as unknown as Product}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}
              </>
            ) : (
              <div className='grid scrollbar-none grid-cols-2 gap-1 sm:grid-cols-3 place-items-center md:grid-cols-3 '>
                {productsData?.products?.map((product, index) => (
                  <ProductCard
                    key={(product._id as string) + index}
                    product={product as unknown as Product}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedCategory && (
          <div>
            {productsByCategory?.categories
              .filter((category) => category.products.length > 0)
              .map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center py-2">
                    <h1 className="text-lg font-semibold">{category.name}</h1>
                    <Button className="bg-transparent text-primary hover:underline hover:bg-transparent">
                      View more
                    </Button>
                  </div>
                  <div className="grid grid-flow-col-dense overflow-x-auto gap-4 scrollbar-none">
                    {category.products.map((product, index) => (
                      <ProductCard key={product._id as string ?? index} product={product as unknown as Product} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
