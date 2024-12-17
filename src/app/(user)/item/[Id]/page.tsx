import { GetServerSideProps } from "next";
import { api } from "~/trpc/react";

interface ProductProps {
  Id: string;
}

const ProductPage = ({ Id }: ProductProps) => {
  // Fetch product details using tRPC
  const { data: product, isLoading, error } = api.product.getProduct.useQuery({ productId:Id  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{product?.title}</h1>
      <p>{product?.description}</p>
      <p>Price: ${product?.price}</p>
    </div>
  );
};

// Fetch the `id` from the route params
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  if (!id) {
    return { notFound: true };
  }

  return {
    props: { id },
  };
};

export default ProductPage;
