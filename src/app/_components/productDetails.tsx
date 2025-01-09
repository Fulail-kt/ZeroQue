// 'use client'
// import React from 'react';
// import { ArrowLeft, MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
// import { Button } from '~/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

// const ProductDetails = () => {
//     const [selectedSize, setSelectedSize] = React.useState('');

//     const sizes = [
//         { id: '1', name: 'Big',qty: },
//         { id: '2', name: 'Small' },
//         { id: '3', name: 'Mini' },
//         { id: '4', name: 'Extra' }
//     ];

//     return (
//         <div className="h-[92vh] md:min-h-screen bg-gray-50 dark:bg-gray-900  md:p-8">
//             {/* Main Container */}
//             <div className="max-w-2xl h-full mx-auto p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none">
//                 {/* Header */}
//                 <div className='flex justify-between w-full px-5 p-2 items-center'>
//                     <Button variant="ghost" size="icon" className="rounded-full justify-start">
//                         <ArrowLeft className="h-6 w-6" />
//                     </Button>
//                     <CardTitle className="text-lg font-semibold">Details</CardTitle>
//                 </div>

//                 {/* Product Image */}
//                 <div className="relative px-5 md:px-0 w-full h-60 md:h-full aspect-square md:aspect-[4/3] overflow-hidden">
//                     <img
//                         src="https://imgs.search.brave.com/1_zEGZsC1e-C_gmE5VXwhZpkRjeo7ngkm10PeIWWhmQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQw/MTM5MjkwNy9waG90/by9pY2VkLWxhdHRl/LW9uLXdvb2Rlbi10/YWJsZS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9QlZjZy1N/WFJZSlR5bFJieXZF/STgyeFhfLVNkelRB/c0szUy1pa0JoWnVo/bz0"
//                         alt="Hot Espresso"
//                         className="w-full rounded-md h-full object-cover"
//                     />
//                 </div>

//                 {/* Product Info */}
//                 <CardContent className="p-6 space-y-4">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <h2 className="text-2xl font-bold dark:text-gray-100">Hot Espresso</h2>
//                             <p className="text-gray-500 dark:text-gray-400 mt-1">
//                                 Rich and aromatic espresso served hot and fresh
//                             </p>
//                         </div>
//                         <span className="text-2xl font-bold dark:text-gray-100">$25</span>
//                     </div>

//                     {/* Size Selection */}
//                     <div className="space-y-2">
//                         <h3 className="text-lg font-semibold dark:text-gray-100">Select type</h3>
//                         <div className="grid overflow-y-auto scrollbar-none grid-flow-col-dense gap-2">
//                             {sizes.map((size) => (
//                                 <div className='flex flex-col'>
//                                     <div
//                                         key={size.id}
//                                         className={`h-12 flex flex-col justify-center items-center ${selectedSize === size.id
//                                                 ? " text-white  bg-gray-800 rounded dark:bg-blue-800 dark:text-gray-200"
//                                                 : " dark:bg-gray-700 border rounded dark:border-none border-gray-300 dark:text-gray-300 flex "
//                                             }`}
//                                         onClick={() => setSelectedSize(size.id)}
//                                     >
//                                         <span>{size.name}</span>
//                                         <span className='text-xs  rounded  text-center '>03</span>
//                                     </div>

//                                 </div>

//                             ))}
//                         </div>
//                     </div>

// <div className=" flex h-12 justify-between px-3 bg-gray-700 rounded-md items-center  md:relative md:border-0 md:p-0 md:mt-8">
//     <span
//         className="  text-lg ">
//         <MinusIcon className="mr-2 h-5 w-5" />
//     </span>
//     <span
//         className="   text-lg ">
//         <PlusIcon className=" h-5 w-5" />
//     </span>
// </div>

//                     {/* Order Button - Fixed at bottom on mobile */}
//                     <div className=" md:relative md:border-0 md:p-0 md:mt-8">
//                         <Button
//                             className="w-full h-14 text-lg dark:bg-orange-500 "
//                             disabled={!selectedSize}
//                         >
//                             <ShoppingCart className="mr-2 h-5 w-5" />
//                             Add to Cart | $25
//                         </Button>
//                     </div>
//                 </CardContent>
//             </div>
//         </div>
//     );
// };

// export default ProductDetails;
// 'use client'
// import React, { useState } from 'react';
// import { ArrowLeft, MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
// import { Button } from '~/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
// import useCartStore from '~/store/store';
// import ImageCarousel from './global/imageCarousel';
// import { api } from '~/trpc/react';
// import { Types } from 'mongoose';

// type ProductSize = {
//   _id: Types.ObjectId|string;
//   name: string;
//   stock: number;
//   price: number;
// };

// type Product = {
//   _id:string;
//   title: string;
//   description: string;
//   company:{_id:string,name:string}
//   images: string[];
//   category: {_id:string,name:string};
//   subCategory:{_id:string,name:string};
//   price?:number;
//   sizes: ProductSize[];
//   status: string;
// };

// interface PageProps{
// productId:string
// }
// const ProductDetails = ({productId}:PageProps) => {
//   console.log(productId)
//   const { addToCart } = useCartStore();
  
//  const {data:productData, isLoading, error}=api.product.getProduct.useQuery({productId:productId})

//  console.log(productData,"product")

//   const [selectedSize, setSelectedSize] = useState<string>(productData?.sizes[0]?._id.toString() || '');
//   const [quantities, setQuantities] = useState<{ [key: string]: number }>(
//     productData?.sizes[0]?._id
//       ? { [productData?.sizes[0]._id.toString()]: 1 }
//       : {}
//   );

//   const handleSizeSelect = (id: string) => {
//     setSelectedSize(id);
//     setQuantities(prev => ({
//       ...prev,
//       [id]: prev[id] || 1,
//     }));
//   };

//   const handleQuantityChange = (operation: 'increment' | 'decrement') => {
//     setQuantities(prev => {
//       // Ensure we have a valid selected size
//       if (!selectedSize) return prev;

//       // Find the selected size object
//       const selectedSizeObj = productData?.sizes.find(size => size._id?.toString() === selectedSize);
//       if (!selectedSizeObj) return prev;

//       // Create a copy of the previous quantities
//       const updatedQuantities = { ...prev };
//       const currentQuantity = updatedQuantities[selectedSize] || 0;

//       // Handle increment
//       if (operation === 'increment' && currentQuantity < selectedSizeObj.stock) {
//         updatedQuantities[selectedSize] = currentQuantity + 1;
//       }
//       // Handle decrement
//       else if (operation === 'decrement' && currentQuantity > 0) {
//         updatedQuantities[selectedSize] = currentQuantity - 1;
//       }

//       return updatedQuantities;
//     });
//   };

//   const calculateTotalPrice = () => {

//     if(productData.sizes.length>0){
//       return Object.keys(quantities).reduce((total, id) => {
//         const size = productData?.sizes.find((s) => s.?_id.toString() === id);
//         return total + (size?.price || 0) * (quantities[id] || 0);
//       }, 0);

//     }else{
//       return productData?.price*quantity ?? 0
//     }
//     }
//   };

//   const getCurrentPrice = () => {
//     const selectedSizeObj = productData?.sizes.find(size => size.?_id.toString() === selectedSize);
//     return selectedSizeObj ? selectedSizeObj.price : 0;
//   };

//   const handleAddToCart = () => {
//     if (!selectedSize) return;

//     const selectedSizeObj = productData?.sizes.find(size => size?._id.toString() === selectedSize);
//     if (!selectedSizeObj) return;

//     const quantity = quantities[selectedSize] || 0;
//     if (quantity > 0) {
//       addToCart({
//         id: `${productData?.title}-${selectedSizeObj._id}`,
//         title: `${productData?.title}`,
//         description: productData?.description??'',
//         category: productData?.category._id.toString() ?? '',
//         price: selectedSizeObj.price,
//         image: productData?.images[0]??'',
//         quantity: quantity,
//         type: selectedSizeObj.name
//       });

//       // Reset selections after adding to cart
//       setQuantities({});
//       setSelectedSize('');
//     }
//   };

//   return (
//     <div className="h-[92vh] md:h-[80vh] bg-gray-50 dark:bg-gray-900 md:dark:bg-transparent md:p-8">
//       <div className="max-w-2xl md:w-full md:max-w-full h-full md:h-fit mx-auto p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none">
//         <div className="flex justify-between w-full px-5 p-2 items-center">
//           <Button variant="ghost" size="icon" className="rounded-full justify-start">
//             <ArrowLeft className="h-6 w-6" />
//           </Button>
//           <CardTitle className="text-lg font-semibold">{productData?.title}</CardTitle>
//         </div>

//         <div className='flex w-full justify-center'>
//           <div className='md:grid-cols-2 md:gap-5 md:w-[80%] grid-col-1 grid place-items-center'>
//             <div className="relative px-5 md:px-0 w-full h-60 md:h-fit   overflow-hidden">
//               {/* <img
//                 src={product.image}
//                 alt={product.title}
//                 className="w-full rounded-md h-full object-cover"
//               /> */}
//               <ImageCarousel images={productData?.images ?? []} />
//             </div>
//             <CardContent className="p-6 space-y-4 w-full">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold dark:text-gray-100">{productData.title}</h2>
//                   <p className="text-gray-500 dark:text-gray-400 mt-1">{productData.description}</p>
//                 </div>
//                 <span className="text-2xl font-bold dark:text-gray-100">
//                   ${getCurrentPrice().toFixed(2)}
//                 </span>
//               </div>
//               <div className="space-y-2">
//                 <h3 className="text-lg font-semibold dark:text-gray-100">Select type</h3>
//                 <div className="grid overflow-y-auto scrollbar-none grid-flow-col-dense gap-2">
//                   {productData?.sizes.map((size) => (
//                     <div
//                       key={size._id.toString()}
//                       className={`h-12 flex flex-col justify-center items-center cursor-pointer ${selectedSize === size._id?.toString()
//                           ? 'text-white bg-gray-800 rounded dark:bg-blue-800 dark:text-gray-200'
//                           : 'dark:bg-gray-700 border rounded dark:border-none border-gray-300 dark:text-gray-300 flex'
//                         }`}
//                       onClick={() => handleSizeSelect(size._id?.toString())}
//                     >
//                       <span>{size.name}</span>
//                       {(quantities[size._id.toString()] ?? 0) > 0 && (
//                         <span className="text-xs">{quantities[size._id?.toString()] || 0}</span>)}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {selectedSize && (
//                 <div className="flex h-12 justify-between px-3 bg-gray-700 rounded-md items-center">
//                   <span
//                     className="text-lg cursor-pointer"
//                     onClick={() => handleQuantityChange('decrement')}
//                   >
//                     <MinusIcon className="h-5 w-5" />
//                   </span>
//                   <p className="text-lg">{quantities[selectedSize] || 0}</p>
//                   <span
//                     className="text-lg cursor-pointer"
//                     onClick={() => handleQuantityChange('increment')}
//                   >
//                     <PlusIcon className="h-5 w-5" />
//                   </span>
//                 </div>
//               )}
//               <div className="md:relative md:border-0 md:p-0 md:mt-8">
//                 <Button
//                   className="w-full h-14 text-lg dark:bg-orange-500"
//                   disabled={!selectedSize || Object.values(quantities).every((qty) => qty === 0)}
//                   onClick={handleAddToCart}
//                 >
//                   <ShoppingCart className="mr-2 h-5 w-5" />
//                   Add to Cart | ${calculateTotalPrice().toFixed(2)}
//                 </Button>
//               </div>
//             </CardContent>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;





/////// 


// 'use client';
// import React, { useState } from 'react';
// import { ArrowLeft, MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
// import { Button } from '~/components/ui/button';
// import { CardTitle, CardContent } from '~/components/ui/card';
// import useCartStore from '~/store/store';
// import ImageCarousel from './global/imageCarousel';
// import { api } from '~/trpc/react';
// import { Types } from 'mongoose';

// type ProductSize = {
//   _id: string;
//   name: string;
//   stock: number;
//   price: number;
// };

// type Product = {
//   _id: string;
//   title: string;
//   description: string;
//   company: { _id: string; name: string };
//   images: string[];
//   category:Types.ObjectId | { _id: string; name: string };
//   subCategory: { _id: string; name: string };
//   price?: number;
//   stock?:number;
//   sizes: ProductSize[];
//   status: string;
// };

// interface PageProps {
//   productId: string;
// }

// const ProductDetails = ({ productId }: PageProps) => {
//   const { addToCart } = useCartStore();

//   // Fetch product data
//   const { data: productData, isLoading, error } = api.product.getProduct.useQuery({ productId });

//   // Handle size selection and quantity
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

//   const handleSizeSelect = (id: string) => {
//     setSelectedSize(id);
//     setQuantities((prev) => ({
//       ...prev,
//       [id]: prev[id] || 1,
//     }));
//   };

//   const handleQuantityChange = (operation: 'increment' | 'decrement') => {

//     if(productData?.sizes.length>0 && productData.price!==null | undefined){

//       const updatedQuantities = { ...prev };
//       const currentQuantity = updatedQuantities[productId] || 0;

//       if (operation === 'increment' && currentQuantity < productData?.stock) {
//         updatedQuantities[productId] = currentQuantity + 1;
//       } else if (operation === 'decrement' && currentQuantity > 0) {
//         updatedQuantities[productId] = currentQuantity - 1;
//       }
//       setQuantities()
//     }
//     setQuantities((prev) => {
//       if (!selectedSize) return prev;

//       const selectedSizeObj = productData?.sizes.find((size) => size._id === selectedSize);
//       if (!selectedSizeObj) return prev;

//       const updatedQuantities = { ...prev };
//       const currentQuantity = updatedQuantities[selectedSize] || 0;

//       if (operation === 'increment' && currentQuantity < selectedSizeObj.stock) {
//         updatedQuantities[selectedSize] = currentQuantity + 1;
//       } else if (operation === 'decrement' && currentQuantity > 0) {
//         updatedQuantities[selectedSize] = currentQuantity - 1;
//       }

//       return updatedQuantities;
//     });
//   };

//   const calculateTotalPrice = () => {
//     if (!productData) return 0;

//     if (productData.sizes && productData.sizes.length > 0) {
//       return Object.keys(quantities).reduce((total, id) => {
//         const size = productData.sizes.find((s) => s._id === id);
//         return total + (size?.price || 0) * (quantities[id] || 0);
//       }, 0);
//     } else {
//       return (productData.price || 0) * (quantities[productData._id] || 1);
//     }
//   };

//   const getCurrentPrice = (): number => {
//     if (!productData) return 0;
//     if (productData.sizes && productData.sizes.length > 0) {
//       if (selectedSize) {
//         const selectedSizeObj = productData.sizes.find(
//           (size) => size?._id === selectedSize
//         );
//         if (selectedSizeObj) return selectedSizeObj.price;
//       }
//       return productData.sizes[0]?.price ?? 0;
//     }
//     return productData.price ?? 0;
//   };
  
  
  
//   const handleAddToCart = () => {
//     if (!productData || !selectedSize) return;
  
//     const selectedSizeObj = productData.sizes.find((size) => size._id === selectedSize);
//     const quantity = quantities[selectedSize] || 0;

//     const category = typeof productData.category === 'object' && 'name' in productData.category 
//       ? productData.category 
//       : { _id: '', name: '' };
  
//     if (selectedSizeObj && quantity > 0) {
//       addToCart({
//         id: `${productData._id}`,
//         title: productData.title,
//         description: productData.description ?? '',
//         category: {
//           _id: productData.category._id instanceof Types.ObjectId 
//             ? productData.category._id.toString() 
//             : String(productData.category._id),
//           name: category.name ?? '',
//         },
//         price: selectedSizeObj.price,
//         sizes: [{ _id: selectedSizeObj._id ?? '', name: selectedSizeObj.name, stock: selectedSizeObj.stock, price: selectedSizeObj.price }], 
//         image: productData.images[0] ?? '',
//         quantity,
//         type: selectedSizeObj.name,
//       });
  
//       setQuantities({});
//       setSelectedSize('');
//     }
//   };

//   if (isLoading) return <p>Loading product details...</p>;
//   if (error || !productData) return <p>Failed to load product details.</p>;

//   return (
//     <div className="h-[92vh] md:h-[80vh] bg-gray-50 dark:bg-gray-900 md:dark:bg-transparent md:p-8">
//       <div className="max-w-2xl md:w-full md:max-w-full h-full md:h-fit mx-auto p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none">
//         <div className="flex justify-between w-full px-5 p-2 items-center">
//           <Button variant="ghost" size="icon" className="rounded-full justify-start">
//             <ArrowLeft className="h-6 w-6" />
//           </Button>
//           <CardTitle className="text-lg font-semibold">{productData.title}</CardTitle>
//         </div>

//         <div className="flex w-full justify-center">
//           <div className="md:grid-cols-2 md:gap-5 md:w-[80%] grid-col-1 grid place-items-center">
//             <div className="relative px-5 md:px-0 w-full h-60 md:h-fit overflow-hidden">
//               <ImageCarousel images={productData.images || []} />
//             </div>
//             <CardContent className="p-6 space-y-4 w-full">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold dark:text-gray-100">{productData.title}</h2>
//                   <p className="text-gray-500 dark:text-gray-400 mt-1">{productData.description}</p>
//                 </div>
//                 <span className="text-2xl font-bold dark:text-gray-100">
//                   ${getCurrentPrice().toFixed(2)}
//                 </span>
//               </div>
//               {productData.sizes?.length > 0 && (
//                 <div className="space-y-2">
//                   <h3 className="text-lg font-semibold dark:text-gray-100">Select type</h3>
//                   <div className="grid overflow-y-auto scrollbar-none grid-flow-col-dense gap-2">
//                     {productData.sizes.map((size) => (
//                       <div
//                         key={size._id}
//                         className={`h-12 flex flex-col justify-center items-center cursor-pointer ${
//                           selectedSize === size._id
//                             ? 'text-white bg-gray-800 rounded dark:bg-blue-800 dark:text-gray-200'
//                             : 'dark:bg-gray-700 border rounded dark:border-none border-gray-300 dark:text-gray-300 flex'
//                         }`}
//                         onClick={() => handleSizeSelect(size?._id!)}
//                       >
//                         <span>{size.name}</span>
//                         {(quantities[size?._id!] ?? 0) > 0 && (
//                           <span className="text-xs">{quantities[size?._id!] || 0}</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
               
//                 <div className="flex h-12 justify-between px-3 bg-gray-700 rounded-md items-center">
//                   <span
//                     className="text-lg cursor-pointer"
//                     onClick={() => handleQuantityChange('decrement')}
//                   >
//                     <MinusIcon className="h-5 w-5" />
//                   </span>
//                   <p className="text-lg">{quantities[selectedSize] || 0}</p>
//                   <span
//                     className="text-lg cursor-pointer"
//                     onClick={() => handleQuantityChange('increment')}
//                   >
//                     <PlusIcon className="h-5 w-5" />
//                   </span>
//                 </div>
              
//               <div className="md:relative md:border-0 md:p-0 md:mt-8">
//                 <Button
//                   className="w-full h-14 text-lg dark:bg-orange-500"
//                   disabled={!selectedSize || Object.values(quantities).every((qty) => qty === 0)}
//                   onClick={handleAddToCart}
//                 >
//                   <ShoppingCart className="mr-2 h-5 w-5" />
//                   Add to Cart | ${calculateTotalPrice().toFixed(2)}
//                 </Button>
//               </div>
//             </CardContent>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;




'use client';
import React, { useState } from 'react';
import { ArrowLeft, MinusIcon, PlusIcon, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CardTitle, CardContent } from '~/components/ui/card';
import useCartStore from '~/store/store';
import ImageCarousel from './global/imageCarousel';
import { api } from '~/trpc/react';
import { Types } from 'mongoose';
import Link from 'next/link';
import useCompanyStore from '~/store/general';
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { motion } from 'framer-motion';

type ProductSize = {
  _id: string;
  name: string;
  stock: number;
  price: number;
};

type Product = {
  _id: string;
  title: string;
  description: string;
  company: { _id: string; name: string };
  images: string[];
  category: Types.ObjectId | { _id: string; name: string };
  subCategory: { _id: string; name: string };
  price?: number;
  stock?: number;
  sizes: ProductSize[];
  status: string;
};

interface PageProps {
  productId: string;
}

const ProductDetails = ({ productId }: PageProps) => {
  const { addToCart } = useCartStore();
  const {companyRoute}=useCompanyStore()


  // Fetch product data
  const { data: productData, isLoading, error } = api.product.getProduct.useQuery({ productId });

  // Handle quantity and size selection
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);

  const handleSizeSelect = (id: string) => {
    setSelectedSize(id);
    setQuantity(1);
  };

  const handleQuantityChange = (operation: 'increment' | 'decrement') => {
    if (!productData) return;

    // For products with sizes
    if (productData.sizes && productData.sizes.length > 0) {
      if (!selectedSize) return;

      const selectedSizeObj = productData.sizes.find((size) => size._id === selectedSize);
      if (!selectedSizeObj) return;

      if (operation === 'increment' && quantity < selectedSizeObj.stock) {
        setQuantity(quantity + 1);
      } else if (operation === 'decrement' && quantity > 0) {
        setQuantity(quantity - 1);
      }
    } 
    // For products without sizes
    else {
      const maxStock = productData?.stock ?? 0;

      if (operation === 'increment' && quantity < maxStock) {
        setQuantity(quantity + 1);
      } else if (operation === 'decrement' && quantity > 0) {
        setQuantity(quantity - 1);
      }
    }
  };

  const calculateTotalPrice = () => {
    if (!productData) return 0;

    // For products with sizes
    if (productData.sizes && productData.sizes.length > 0) {
      const selectedSizeObj = productData.sizes.find((s) => s._id === selectedSize);
      return (selectedSizeObj?.price ?? 0) * quantity;
    } 
    // For products without sizes
    else {
      return (productData.price ?? 0) * quantity;
    }
  };

  const getCurrentPrice = (): number => {
    if (!productData) return 0;

    // For products with sizes
    if (productData.sizes && productData.sizes.length > 0) {
      if (selectedSize) {
        const selectedSizeObj = productData.sizes.find(
          (size) => size?._id === selectedSize
        );
        if (selectedSizeObj) return selectedSizeObj.price;
      }
      return productData.sizes[0]?.price ?? 0;
    }
    
    // For products without sizes
    return productData.price ?? 0;
  };
  
  const handleAddToCart = () => {
    if (!productData || quantity === 0) return;
  
    const category = typeof productData.category === 'object' && 'name' in productData.category 
      ? productData.category 
      : { _id: '', name: '' };
  
    // For products with sizes
    if (productData.sizes && productData.sizes.length > 0) {
      const selectedSizeObj = productData.sizes.find((size) => size._id === selectedSize);
  
      if (selectedSizeObj) {
        addToCart({
          id: `${productData._id}`,
          title: productData.title,
          description: productData.description ?? '',
          category: {
            _id: productData.category._id instanceof Types.ObjectId 
              ? productData.category._id.toString() 
              : String(productData.category._id as string),
            name: category.name ?? '',
          },
          price: selectedSizeObj.price, 
          image: productData.images[0] ?? '',
          quantity,
          stock:selectedSizeObj.stock,
          type: selectedSizeObj.name,
        });
      }
    } 
    // For products without sizes
    else {
      addToCart({
        id: `${productData._id}`,
        title: productData.title,
        description: productData.description ?? '',
        category: {
          _id: productData.category._id instanceof Types.ObjectId 
            ? productData.category._id.toString() 
            : String(productData.category._id as string),
          name: category.name ?? '',
        },
        price: productData.price ?? 0,
        stock:productData.stock ?? 0, 
        image: productData.images[0] ?? '',
        quantity,
        type: 'Standard', // Default type for non-sized products
      });
    }
  
    // Reset selection
    setQuantity(0);
    setSelectedSize('');
  };

  const StockIndicator = ({ stock }: { stock: number }) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm text-muted-foreground">
        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
      </span>
    </div>
  );

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2" />
    </div>
  );
  
  if (error || !productData) return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg text-red-500">Failed to load product details.</p>
    </div>
  );

  return (
    <div className=" bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation */}
        {/* <nav className="flex items-center justify-between mb-8">
          <Link href={`/${companyRoute!}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-secondary">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Shop</span>
            </Button>
          </Link>
        </nav> */}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div 
            className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
            {...fadeIn}
          >
            <div className="h-full">
              <ImageCarousel images={productData.images || []} />
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div 
            className="space-y-6"
            {...fadeIn}
          >
            <div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {typeof productData.category === 'object' && 'name' in productData.category 
                      ? productData.category.name 
                      : 'Unknown Category'}
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tight">{productData.title}</h1>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${getCurrentPrice().toFixed(2)}
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{productData.description}</p>
            </div>

            {/* <Separator className='h-[0.8px]'/> */}
            <div className='w-full bg-gray-400 h-[1px] !my-2 '></div>

            {/* Size/Type Selection */}
            {productData.sizes?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select Type</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productData.sizes.map((size) => (
                    <Button
                      key={size._id}
                      variant={selectedSize === size._id ? "default" : "outline"}
                      className="h-12"
                      onClick={() => handleSizeSelect(size._id!)}
                    >
                      <span>{size.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="">
              <h3 className="text-lg font-medium mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-between w-full h-12 rounded-md border border-input">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full rounded-none"
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity === 0}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{quantity}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full rounded-none"
                    onClick={() => handleQuantityChange('increment')}
                    disabled={quantity >= (productData.stock ?? 0)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Total and Add to Cart */}
            <div className="">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${calculateTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full h-14 text-lg"
                disabled={(productData.sizes?.length > 0 && !selectedSize) || quantity === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;