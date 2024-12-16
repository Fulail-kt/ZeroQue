import { Types } from 'mongoose';

export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
}

export interface ProductSubcategory {
  _id: string;
  name: string;
  description?: string;
}

export interface ProductSize {
  name: string;
  stock: number;
  price: number;
}

export interface Product {
  _id: string | Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  sizes: ProductSize[];
  isDisabled?: boolean;
}

export interface ProductCardProps {
  product: Product;
}