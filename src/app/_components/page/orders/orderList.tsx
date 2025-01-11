
'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Pagination from '~/app/_components/global/pagination';
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import OrderSwipeCard from '~/app/_components/global/orderSwipeCard';
import { Order } from './types';
import StatusChangeDialog from './orderUpdateModal';


// Types
export interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

export interface Payment {
  method: string;
  status: string;
  refNumber: string;
}


interface OrderListProps {
  pageSize?: number;
}

// Skeleton Loading Component
const OrderSkeleton: React.FC = () => (
  <Card className="w-full animate-pulse">
    <CardContent className="p-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-6 w-1/3 bg-gray-400 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-gray-400 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="h-6 w-20 bg-gray-400 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-400 rounded"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const OrderList: React.FC<OrderListProps> = ({ pageSize = 6 }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | "preparing" | "ready">('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: session } = useSession();
  const companyId = session?.user?.companyId ?? "";
  const utils = api.useUtils();

  const { 
    data: ordersData, 
    isLoading, 
    isError,
    error,
    refetch 
  } = api.order.getOrders.useQuery({
    companyId,
    page: currentPage,
    pageSize,
    search: searchQuery,
    status: activeTab
  }, { 
    enabled: !!companyId,
    retry: 3,
    // onError: (error) => {
    //   toast.error("Failed to load orders: " + error.message);
    // }
  });

  const { 
    mutate: updateOrderStatus,
    mutateAsync: updateOrderStatusAsync,
    status: mutationStatus,
    isPending 
  } = api.order.updateOrderStatus.useMutation({
    onSuccess:async() => {
      toast.success("Order status updated successfully");
      await utils.order.getOrders.invalidate();
      setStatusDialog(prev => ({ ...prev, isOpen: false }));
    },
    onError: (error) => {
      toast.error("Failed to update order status: " + error.message);
    },
  });

  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    order: Order | null;
    newStatus: Order['status'];
  }>({
    isOpen: false,
    order: null,
    newStatus: 'pending'
  });

  const handleSwipeLeft = (order: Order) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled', 'failed'] as const;
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex > 0) {
      const newStatus = statusFlow[currentIndex - 1];
      handleStatusChange(order, newStatus!);
    }
  };

  const handleSwipeRight = (order: Order) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled', 'failed'] as const;
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1];
      handleStatusChange(order, newStatus!);
    }
  };

  const handleStatusChange = (order: Order, newStatus: Order['status']) => {
    setStatusDialog({
      isOpen: true,
      order,
      newStatus
    });
  };

  const handleStatusConfirm = async (data: { status: Order['status'], prepTime?: number }) => {
    if (!statusDialog.order) return;

    try {
      await updateOrderStatusAsync({
        orderId: statusDialog.order._id.toString(),
        companyId,
        status: data.status,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: Date): string => {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getStatusColor = (status: Order['status']): string => {
    const statusColors: Record<Order['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled'] as const;

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please log in to view orders.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-red-500">Error loading orders: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='flex max-w-7xl flex-col items-center justify-center w-full'>
      <div className="flex h-16 mt-2 justify-between w-full items-center p-4">
        <h1 className='text-2xl uppercase font-semibold'>ORDERS</h1>
      </div>
      <div className="space-y-6 pt-2 p-5 w-full">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          {(['pending', 'confirmed', "preparing", "ready"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              disabled={isLoading}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Search */}
        <Input
          placeholder="Search by customer name, email, or phone..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
          disabled={isLoading}
        />
        {/* Orders List */}
        <div className="grid gap-3">
          {isLoading ? (
            Array.from({ length:3 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))
          ) : ordersData?.orders?.length ? (
            ordersData.orders.map((order) => (
              <OrderSwipeCard
                key={order._id.toString()}
                currentStatus={order.status}
                onSwipeLeft={() => handleSwipeLeft(order)}
                onSwipeRight={() => handleSwipeRight(order)}
                onViewOrder={() => setSelectedOrder(order)}
              >
                <Card className="cursor-pointer w-full hover:shadow-md transition-shadow">
                  <CardContent className="p-3 relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-semibold text-base truncate">{order.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p className="truncate">{order.email}</p>
                          <div className="flex items-center gap-4">
                            <span>{order.phone1}</span>
                            <span>•</span>
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-base mb-1">₹ {order.total}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        <span className='flex items-center gap-x-1 interactive-element' onClick={handleSelectClick}>
                          Status
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusChange(order, value as Order['status'])}
                            disabled={isPending}
                          >
                            <SelectTrigger className="!h-7 mt-1 gap-x-2 focus:outline-none outline-none focus:ring-0 ring-offset-0">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Payment: {order.payment.method}
                      </span>
                      <span className="text-xs text-gray-500">
                        Status: {order.payment.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </OrderSwipeCard>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2">
              <p>No {activeTab} orders found.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-500 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="font-semibold">Customer Information</h3>
                    <p>Name: {selectedOrder.name}</p>
                    <p>Email: {selectedOrder.email}</p>
                    <p>Phone: {selectedOrder.phone1}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Order Items</h3>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span>{item.title}</span>
                        <span>₹ {item.price} × {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹ {selectedOrder.total}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Payment Details</h3>
                    <p>Method: {selectedOrder.payment.method}</p>
                    <p>Status: {selectedOrder.payment.status}</p>
                    <p>Reference: {selectedOrder.payment.refNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        {ordersData?.pagination && (
          <Pagination
            currentPage={ordersData.pagination.currentPage}
            pageSize={ordersData.pagination.pageSize}
            totalPages={ordersData.pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Status Change Dialog */}
      <StatusChangeDialog
  isOpen={statusDialog.isOpen}
  onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
  onConfirm={handleStatusConfirm}
  order={statusDialog.order}
  newStatus={statusDialog.newStatus}
/>

{isPending && (
        <div className="fixed h-screen w-full inset-0 bg-black/45 flex items-center justify-center z-50">
          <div className=" p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Updating order status...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;