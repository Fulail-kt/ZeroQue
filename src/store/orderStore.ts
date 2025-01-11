import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface PaymentDetails {
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

interface Coupon {
  code?: string;
  discount: number;
}

export interface Order {
  _id: string;
  userId?: string;
  companyId: string;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
  items: OrderItem[];
  total: number;
  payment: PaymentDetails;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready'|'cancelled' ;
  coupon?: Coupon;
  paymentAttempts: number;
  lastPaymentAttempt?: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
  preparationStartTime?: Date;
  completionTime?: Date;
  estimatedTime?: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  
  
  // Order Management
  createOrder: (orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  getPendingOrders: () => Order[];
  
  // Payment Management
  updatePaymentStatus: (
    orderId: string,
    status: PaymentDetails['status'],
    details?: Partial<PaymentDetails>
  ) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // UPI Payment Specific
  incrementPaymentAttempts: (orderId: string) => void;
  setPaymentError: (orderId: string, error: string) => void;
  
  // Order Processing
  setPreparationStartTime: (orderId: string) => void;
  setCompletionTime: (orderId: string) => void;
  setEstimatedTime: (orderId: string, minutes: number) => void;
  
  // Utility Functions
  clearOrders: () => void;
  cleanupOldOrders: (daysToKeep: number) => void;
}

const useOrderStore = create(
  persist<OrderState>(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      createOrder: (orderData) => {
        const newOrder: Order = {
          _id: `order_${Date.now()}`,
          ...orderData,
          paymentAttempts: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder
        }));

        return newOrder;
      },

      updateOrder: (orderId, updates) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? { ...order, ...updates, updatedAt: new Date() }
              : order
          )
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order._id !== orderId)
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order._id === orderId);
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status);
      },

      updatePaymentStatus: (orderId, status, details) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  payment: {
                    ...order.payment,
                    ...details,
                    status,
                    lastAttempt: new Date()
                  },
                  updatedAt: new Date()
                }
              : order
          )
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          )
        }));
      },

      incrementPaymentAttempts: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  paymentAttempts: (order.paymentAttempts || 0) + 1,
                  lastPaymentAttempt: new Date(),
                  updatedAt: new Date()
                }
              : order
          )
        }));
      },

      setPaymentError: (orderId, error) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? { ...order, lastError: error, updatedAt: new Date() }
              : order
          )
        }));
      },

      setPreparationStartTime: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  preparationStartTime: new Date(),
                  status: 'preparing',
                  updatedAt: new Date()
                }
              : order
          )
        }));
      },

      setCompletionTime: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  completionTime: new Date(),
                  status: 'ready',
                  updatedAt: new Date()
                }
              : order
          )
        }));
      },

      setEstimatedTime: (orderId, minutes) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? { ...order, estimatedTime: minutes, updatedAt: new Date() }
              : order
          )
        }));
      },

      clearOrders: () => {
        set({ orders: [], currentOrder: null });
      },

      cleanupOldOrders: (daysToKeep) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        set((state) => ({
          orders: state.orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            if (order.status === 'ready' || order.status === 'cancelled') {
              return orderDate >= cutoffDate;
            }
            return true;
          })
        }));
      },
      getPendingOrders: () => {
        return get().orders.filter(order => 
          ['pending', 'processing'].includes(order.status)
        );
      },
    }),
    {
      name: "order-storage",
      version: 1
    }
  )
);

export default useOrderStore;