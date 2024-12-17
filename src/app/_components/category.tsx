'use client'

import { TRPCClientError } from '@trpc/client';
import React from 'react'
import { ICategory } from '~/server/db/category/category';
import { api } from '~/trpc/react'

interface CategoryProps {
  selectedCategory: ICategory | null;
  setSelectedCategory: (category: ICategory) => void;
}

const Category: React.FC<CategoryProps> = ({selectedCategory, setSelectedCategory }) => {
  
  const { data: categoryQueryResult, isLoading,error} = api.product.getCategories.useQuery({
    companyId: '674ac8e13644f51bd33ad5a0',
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading categories</div>;
  }

  const categories = categoryQueryResult?.categories ?? [];

  return (
    <div className='grid grid-flow-col-dense w-full overflow-y-auto scrollbar-none'>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category._id?.toString()} className='flex gap-1 p-2'>
            <h1
              className={`${
                selectedCategory?._id === category._id?.toString()  ? 'bg-purple-500 text-gray-600' : ''
              } text whitespace-nowrap`}
              onClick={() => setSelectedCategory(category || {})}
            >
              {category.name}
            </h1>
          </div>
        ))
      ) : (
        <div>No categories available</div>
      )}
    </div>
  );
}

export default Category;
