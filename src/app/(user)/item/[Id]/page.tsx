import React from 'react'
import ProductDetails from '../../../_components/productDetails'
import { getSession } from '~/server/auth/config';


const page = async ({params}:{params:{Id:string}}) => {

  const session = await getSession();
console.log(session);  // This will log the company's _id
// console.log(session.);   // This will log the user's role
  
  return (
    <div>
        <ProductDetails productId={params.Id}/>
    </div>
  )
}

export default page