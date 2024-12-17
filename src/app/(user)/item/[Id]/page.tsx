'use client'
import { useRouter } from "next/router";
import { api } from "~/trpc/react";

export default function ProductDetailPage() {
  const router = useRouter();
  const productId = router.query.Id as string;

  const { data: product, isLoading, error } = api.product.getProduct.useQuery(
    { productId },
    { 
      enabled: !!productId,
      // Optional: only query if productId is valid
      // You might want to add additional validation here
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      {/* <p>Category: {product.category}</p> */}
    </div>
  );
}