// // import React from 'react';
// import ProductDetails from '../../../_components/productDetails';
// // import { getSession } from '~/server/auth/config';
// // import { Metadata } from 'next';

// // // Use explicit type definition for params
// // export type PageProps = {
// //   params: {
// //     Id: string;
// //   };
// // };

// // export default async function Page({ params }: PageProps) {
// //   const session = await getSession();
// //   console.log(session); // Log session details for debugging

// //   return (
// //     <div>
// //       <ProductDetails productId={params.Id} />
// //     </div>
// //   );
// // }

// // // Explicitly type the generateMetadata function
// // export async function generateMetadata({ 
// //   params 
// // }: PageProps): Promise<Metadata> {
// //   return {
// //     title: `Product ${params.Id}`,
// //   };
// // }

// import { Metadata } from 'next';

// // Define params type explicitly
// type Params = {
//   Id: string;
// };

// // Define PageProps with explicit typing
// type PageProps = {
//   params: Params;
// };

// export default async function Page({ params }: PageProps) {
//   // Import getSession inside the function to avoid potential import issues
//   const { getSession } = await import('~/server/auth/config');
//   const session = await getSession();
//   console.log(session); // Log session details for debugging

//   return (
//     <div>
//       <ProductDetails productId={params.Id} />
//     </div>
//   );
// }

// // Metadata generation function
// export async function generateMetadata({ 
//   params 
// }: { 
//   params: Params 
// }): Promise<Metadata> {
//   return {
//     title: `Product ${params.Id}`,
//   };
// }