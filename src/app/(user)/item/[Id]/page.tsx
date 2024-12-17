// 'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import ProductDetails from "~/app/_components/productDetails";

// import { useRouter } from 'next/router';

// import React from 'react'
// import ProductDetails from '~/app/_components/productDetails';

// const Page = () => {
//     const router = useRouter();
//     const productId = router.query.Id as string;
//   return (
//     <div><ProductDetails productId={productId} /></div>
//   )
// }

// export default Page

// src/app/product/[id]/page.tsx
//@ts-nocheck
export default function Page({ params }: { params: { id: string } }) {
    const productId = params.id;
    
    return <ProductDetails productId={productId} />;
  }