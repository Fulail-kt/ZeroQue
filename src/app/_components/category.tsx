'use client'

import { TRPCClientError } from '@trpc/client';
import React from 'react'
import { ICategory, ICategoryDTO } from '~/server/db/category/category';
import { api } from '~/trpc/react'
import Loading from './global/loading';
import useCompanyStore from '~/store/general';
import { Types } from 'mongoose';

interface CategoryProps {
  selectedCategory: ICategory | ICategoryDTO|null;
  setSelectedCategory: (category: ICategory) => void;
}

const Category: React.FC<CategoryProps> = ({ selectedCategory, setSelectedCategory }) => {
  const { companyId } = useCompanyStore();

  const { data: categoryQueryResult, isLoading, error } = api.product.getCategories.useQuery({
    companyId: companyId as string,
  }, {
    enabled: !!companyId
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading categories</div>;
  }

  const defaultCategory: ICategory = {
    _id: 'all', 
    name: 'All',
    description: 'View all categories',
    subcategories: [],
    isActive: true,
    company: new Types.ObjectId('000000000000000000000000'),
    createdAt: new Date(),
    updatedAt: new Date(),
    $assertPopulated: () => {},
    $clone: () => ({}),
  } as unknown as ICategory;

  const categories = [defaultCategory, ...(categoryQueryResult?.categories ?? [])];

  return (
    <div className='grid grid-flow-col-dense w-full overflow-y-auto scrollbar-none'>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category._id?.toString()} className='flex gap-1 p-2'>
            <h1
              className={`${
                selectedCategory?._id === category._id?.toString() ? 'bg-purple-500 text-white' : ''
              } text whitespace-nowrap capitalize cursor-pointer`}
              onClick={() => setSelectedCategory(category)}
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
