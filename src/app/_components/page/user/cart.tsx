'use client'
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger, 
  SheetClose
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import useCartStore from '~/store/store';
import Link from 'next/link';
import useCompanyStore from '~/store/general';

// Product Type Definition
type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: {_id:string,name:string};
  type: string;
  quantity: number;
  stock: number;
  price: number;
};

// Cart Item Component
const CartItem: React.FC<{
  item: Product;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ item, onIncrease, onDecrease, onRemove }) => (
  <div className="flex items-center justify-between border-b py-2">
    <div className="flex items-center space-x-4">
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-16 h-16 object-cover rounded"
      />
      <div>
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm">{item.type}</p>
        <p className="text-muted-foreground">₹ {item.price.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Button 
        className='p-0 h-5 rounded-full'
        variant="outline" 
        size="sm" 
        onClick={() => onDecrease(item.id)}
      >
        <Minus className="h-2 w-2"/>
      </Button>
      <span className='text-xs'>{item.quantity}</span>
      <Button 
        className='p-0 h-5 rounded-full'
        variant="outline" 
        size="sm" 
        onClick={() => onIncrease(item.id)}
      >
        <Plus className="h-2 w-2"/>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4 text-destructive"/>
      </Button>
    </div>
  </div>
);

export const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCartStore();
  const {companyRoute} =useCompanyStore()

  const calculateTotal = (): number => {
    return cart.reduce((total: number, item: { price: number; quantity: number; }) => 
      total + item.price * item.quantity, 0);
  };

  const handleIncreaseQuantity = (id: string): void => {
    const item = cart.find((cartItem: { id: string; }) => cartItem.id === id);
    if (item) {
      // Check if adding one more would exceed stock
      if (item.quantity + 1 > item.stock) {
        alert( `Only ${item.stock} items available for ${item.title}`
        );
        return;
      }

      useCartStore.getState().addToCart({
        ...item,
        quantity: 1
      });
    }
  };

  const handleDecreaseQuantity = (id: string): void => {
    const item = cart.find((cartItem: { id: string; }) => cartItem.id === id);
    if (item && item.quantity > 1) {
      useCartStore.getState().addToCart({
        ...item,
        quantity: -1
      });
    } else if (item && item.quantity === 1) {
      removeFromCart(id);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="justify-center relative">
          <ShoppingCart className="h-5 w-5 md:hidden" />
          <span className='md:block hidden'>Cart</span>
          {cart.length > 0 && (
            <>
            <span className="absolute md:hidden  -top-2 -right-2 bg-destructive text-white rounded-full px-1.5 py-0.5 text-xs">
              {cart.length}
            </span>

            {/* <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full px-1.5 py-0.5 text-xs">
              {cart.length}
            </span> */}
            </>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="bottom" 
        className="h-[95vh] rounded-t-xl w-full"
      >
        <div className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          
          <div className="mt-4 space-y-4 flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Your cart is empty
              </p>
            ) : (
              cart.map((item) => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <SheetFooter className="mt-4">
              <div className="w-full">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">₹ {calculateTotal().toFixed(2)}</span>
                </div>
                <Link href={`/${companyRoute!}/checkout`}>
                  <SheetClose asChild>
                    <Button
                      className="w-full"
                      disabled={cart.length === 0}
                      onClick={() => {
                        // Add navigation or checkout logic here
                        console.log('Proceeding to checkout');
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </SheetClose>
                </Link>
              </div>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const CartIcon: React.FC = () => {
  const { cart } = useCartStore();

  return (
    <Button variant="ghost" className="justify-center md:hidden relative">
      <ShoppingCart className="h-5 w-5" />
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full px-1.5 py-0.5 text-xs">
          {cart.length}
        </span>
      )}
    </Button>
  );
};