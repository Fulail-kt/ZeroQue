import React from 'react';
import ProductDetails from '../../../_components/productDetails';
import { getSession } from '~/server/auth/config';

interface PageProps {
  params: { 
    Id: string 
  }; 
}

export default async function Page({ params }: PageProps) {
  const session = await getSession();
  console.log(session); // Log session details for debugging

  return (
    <div>
      <ProductDetails productId={params.Id} />
    </div>
  );
}