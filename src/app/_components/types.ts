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




//// payment types


export interface PaymentStatus {
  status: "failed" | "pending" | "completed";
  lastUpdated: Date;
  attempts: number;
  orderStatus: "failed" | "pending" | "completed" | "confirmed" | "preparing" | "ready" | "cancelled";
  error?: string;
}

export interface UPIPaymentData {
  upiUrl: string;
  orderId: string;
  qrCode: string;
  refNumber: string;
  expiresAt: Date;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}