// OrderList.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import SwipeCard from '~/app/_components/global/swipeCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import Pagination from '~/app/_components/global/pagination';
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import type { Order, OrdersResponse } from './types';

const OrderList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: session } = useSession();
  const companyId = session?.user?.companyId ?? "";

  const { data: ordersData, isLoading } = api.order.getOrders.useQuery({
    companyId,
    page: currentPage,
    pageSize: 6,
    search: searchQuery,
  }, { 
    enabled: !!companyId 
  });

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

  const getStatusColor = (status: Order['status']): string => {
    const statusColors: Record<Order['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='flex justify-center w-full'>
      <div className="space-y-4 p-4 max-w-6xl w-full">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          {(['active', 'inactive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
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
          className="max-w-md"
        />
        {/* Orders List */}
        <div className="grid gap-3">
          {isLoading ? (
            <div className="text-center py-4">Loading orders...</div>
          ) : ordersData?.orders?.length ? (
            ordersData.orders.map((order) => (
              <SwipeCard
                key={order._id.toString()}
                onSwipeLeft={() => {/* Handle status change */}}
                onSwipeRight={() => {/* Handle status change */}}
                activeTab={activeTab}
                className="w-full"
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section - Main Info */}
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
                      {/* Right Section - Price & Time */}
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-base mb-1">₹{order.total}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    {/* Bottom Section */}
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
              </SwipeCard>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No {activeTab} orders found.
            </div>
          )}
        </div>
        {/* Order Details Dialog - Keeping the same as before */}
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
                        <span>₹{item.price} × {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.total}</span>
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
    </div>
  );
};

export default OrderList;