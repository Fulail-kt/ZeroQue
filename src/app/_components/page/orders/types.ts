// types.ts
import { Types } from 'mongoose';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface PaymentDetails {
  method: 'cash' | 'online' | 'upi';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  upiId?: string;
  refNumber?: string;
  attempts: number;
  lastAttempt?: Date;
  error?: string;
  expiresAt?: Date;
  qrCode?: string;
  upiUrl?: string;
}

export interface Order {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
  items: OrderItem[];
  total: number;
  payment: PaymentDetails;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'cancelled' | 'failed';
  coupon?: {
    code?: string;
    discount?: number;
  };
  paymentAttempts: number;
  lastPaymentAttempt?: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
  preparationStartTime?: Date;
  completionTime?: Date;
  estimatedTime?: number;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationInfo;
}