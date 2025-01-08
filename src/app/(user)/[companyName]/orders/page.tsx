


'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Package, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import useOrderStore, { Order } from '~/store/orderStore';

const MyOrders = () => {
//   const orders = useOrderStore((state) => state.orders);
  const orders: Order[] = useOrderStore((state) => state.orders) ?? [];


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/10 text-green-500 dark:bg-green-500/20';
      case 'in transit':
        return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20';
      case 'processing':
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-2 py-4">
      <div className="flex items-center gap-1 mb-4">
        <ShoppingBag className="w-5 h-5" />
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {/* Orders Section */}
      {orders && orders.length > 0 ? (
        <>
          {/* Recent Order */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Recent Order</h2>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-3">
                <div className="flex flex-col lg:flex-row justify-between gap-3">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-medium">{orders[0]?._id}</p>
                      </div>
                      <Badge className={`${getStatusColor(orders[0]?.payment?.status??"")}`}>
                        {orders[0]?.payment.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {orders[0]?.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="lg:w-56 space-y-2 lg:border-l lg:pl-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Order Date</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <p className="text-sm">N/A</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold">₹{orders[0]?.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Previous Orders */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Previous Orders</h2>
            <div className="space-y-2">
              {orders.slice(1).map((order) => (
                <Card key={order._id} className="hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{order._id}</p>
                          <Badge className={`${getStatusColor(order.payment.status)}`}>
                            {order.payment.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">N/A</p>
                        <div className="mt-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-xs">
                              {item.quantity}x {item.title}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:w-28 sm:border-l sm:pl-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
