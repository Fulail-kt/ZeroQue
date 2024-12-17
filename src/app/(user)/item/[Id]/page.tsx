import React from 'react';
import ProductDetails from '../../../_components/productDetails';
import { getSession } from '~/server/auth/config';
import { Metadata } from 'next';

// Use Params type from Next.js
export interface Params {
  Id: string;
}

// Explicit type for page props using Next.js types
export interface PageProps {
  params: Params;
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

// Optional: Add generateMetadata if needed
export async function generateMetadata({ 
  params 
}: { 
  params: Params 
}): Promise<Metadata> {
  return {
    title: `Product ${params.Id}`,
  };
}