import React from 'react'
import ProductDetails from '~/app/_components/page/user/productDetails'

export default async function Page({params}:{params:Promise<{Id:string}>}){
    const ProductId = (await params).Id
  return (
    <div>
        <ProductDetails productId={ProductId} />
    </div>
  )
}

