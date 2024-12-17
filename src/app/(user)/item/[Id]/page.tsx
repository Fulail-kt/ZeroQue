// import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { api } from "~/trpc/react"; // Import your tRPC hook

// interface ProductPageProps {
//   params: { Id: string };
// }

// export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
//   const id = params.Id;

//   // Fetch the product name for dynamic metadata
//   const {data:product} = await api.product.getProduct.useQuery({productId:id})

//   if (!product) {
//     return { title: "Product Not Found" };
//   }

//   return { title: `Product: ${product?.title}` };
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const id = params.Id;

//   // Fetch product data using an API or tRPC
//   const {data:product} =  await api.product.getProduct.useQuery({productId:id})

//   if (!product) {
//     notFound(); // Show 404 page
//   }

//   return (
//     <div>
//       <h1>{product?.title}</h1>
//       <p>{product?.description}</p>
//       <p>Price: ${product.price}</p>
//     </div>
//   );
// }


import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "~/trpc/react"; // tRPC hook for client-side (you won't use this on server-side)
import  {ProductModel}  from "~/server/db/product"; // Mongoose model for products

interface ProductPageProps {
  params: { Id: string };
}

// Generate Metadata for Dynamic Head Tag
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const id = params.Id;

  // Fetch product data directly using Mongoose
  const product = await ProductModel.findById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return { title: `Product: ${product.title}` };
}

// Server-Side Component
export default async function ProductPage({ params }: ProductPageProps) {
  const id = params.Id;

  // Fetch product data directly using Mongoose
  const product = await ProductModel.findById(id);

  if (!product) {
    notFound(); // Show 404 page
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}
