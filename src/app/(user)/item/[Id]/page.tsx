import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "~/trpc/react"; // Import your tRPC hook

interface ProductPageProps {
  params: { Id: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const id = params.Id;

  // Fetch the product name for dynamic metadata
  const {data:product} = await api.product.getProduct.useQuery({productId:id})

  if (!product) {
    return { title: "Product Not Found" };
  }

  return { title: `Product: ${product?.title}` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = params.Id;

  // Fetch product data using an API or tRPC
  const {data:product} =  await api.product.getProduct.useQuery({productId:id})

  if (!product) {
    notFound(); // Show 404 page
  }

  return (
    <div>
      <h1>{product?.title}</h1>
      {/* <p>{product?.description}</p>
      <p>Price: ${product.price}</p> */}
    </div>
  );
}
