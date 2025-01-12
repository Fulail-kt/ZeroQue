'use client';
import React, { useState } from 'react';
import { ArrowLeft, MinusIcon, PlusIcon, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CardTitle, CardContent } from '~/components/ui/card';
import useCartStore from '~/store/store';
import ImageCarousel from '../../global/imageCarousel';
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
                  ₹ {getCurrentPrice().toFixed(2)}
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
                  ₹ {calculateTotalPrice().toFixed(2)}
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