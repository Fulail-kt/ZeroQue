import { z } from 'zod';
import { Types } from 'mongoose';
import { protectedProcedure } from '../trpc';
import { OrderModel } from '~/server/db/order/order';

// Updated interface with proper optional types
interface IOrder {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
  companyId: Types.ObjectId;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  payment: {
    method: string;
    status: string;
    attempts: number;
    lastAttempt?: Date;  
    upiUrl?: string;
    qrCode?: string;
    refNumber: string;
    expiresAt: Date;
  };
  status: string;
  coupon?: {
    discount: number;
  };
  paymentAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  lastPaymentAttempt?: Date;
}

// Input validation schema
const OrderQuerySchema = z.object({
  companyId: z.string(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(6),
  search: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const getOrders = protectedProcedure
  .input(OrderQuerySchema)
  .query(async ({ input }) => {
    const { companyId, page, pageSize, search, status, startDate, endDate } = input;
    const skip = (page - 1) * pageSize;

    // Construct base query
    const query: Record<string, unknown> = {
      companyId: new Types.ObjectId(companyId)
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add search functionality
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone1: searchRegex },
        { 'payment.refNumber': searchRegex }
      ];
    }

    try {
      // Perform parallel queries for better performance
      const [totalOrders, orders] = await Promise.all([
        OrderModel.countDocuments(query),
        OrderModel.find(query)
          .sort({ createdAt: -1 }) // Most recent orders first
          .skip(skip)
          .limit(pageSize)
          .lean()
      ]);

      // Process orders with type safety
      const processedOrders = orders.map(order => ({
        ...order,
        timeElapsed: calculateTimeElapsed(order.createdAt),
        paymentStatus: determinePaymentStatus(order as IOrder),
      }));

      return {
        orders: processedOrders,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalOrders / pageSize),
          totalOrders
        }
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  });

// Helper function to calculate time elapsed
function calculateTimeElapsed(createdAt: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}

// Helper function to determine payment status with null checks
function determinePaymentStatus(order: IOrder): {
  status: string;
  isExpired: boolean;
  attemptsRemaining: number;
} {
  const now = new Date();
  const isExpired = order.payment.expiresAt < now;
  const maxAttempts = 3;
  const attemptsRemaining = Math.max(0, maxAttempts - (order.paymentAttempts || 0));

  return {
    status: order.payment.status,
    isExpired,
    attemptsRemaining
  };
}