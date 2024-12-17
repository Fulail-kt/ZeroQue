import React from 'react';
import ProductDetails from '../../../_components/productDetails';
import { getSession } from '~/server/auth/config';

interface PageProps {
  params: {
    Id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getSession();
  console.log(session); // This will log the company's _id
  // console.log(session.role); // Log user's role if needed
  
  return (
    <div>
      <ProductDetails productId={params.Id} />
    </div>
  );
};

export default Page;
