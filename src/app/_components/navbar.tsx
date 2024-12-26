// 'use client'
// import React from 'react';
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetFooter,
//   SheetTrigger,
// } from "~/components/ui/sheet";
// import { 
//   Trash2, 
//   Search, 
//   Bell, 
//   ShoppingCart, 
//   Plus, 
//   Minus 
// } from "lucide-react";
// import { ModeToggle } from './darkMode';
// import useCartStore from '~/store/store';

// // Product Type Definition
// type Product = {
//   id:string
//   title: string;
//   description: string;
//   image: string;
//   category: string;
//   type:string;
//   quantity:number;
//   price: number;
// };


// interface CartItemProps{
//   item: Product;
//   onIncrease: (id: string) => void;
//   onDecrease: (id: string) => void;
//   onRemove: (id: string) => void;
// }


// // Cart Item Component
// const CartItem : React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => (
//   <div className="flex items-center justify-between border-b py-2">
//     <div className="flex items-center space-x-4">
//       <img 
//         src={item.image} 
//         alt={item.title} 
//         className="w-16 h-16 object-cover rounded"
//       />
//       <div>
//         <h3 className="font-semibold">{item.title}</h3>
//         <p className="text-sm">{item.type}</p>
//         <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
//       </div>
//     </div>
//     <div className="flex items-center space-x-2">
//       <Button 
//       className='p-0 h-5 rounded-full'
//         variant="outline" 
//         size="sm" 
//         onClick={() => onDecrease(item.id)}
//       >
//         <Minus className="h-2 w-2"/>
//       </Button>
//       <span className='text-xs'>{item.quantity}</span>
//       <Button 
//       className='p-0 h-5 rounded-full'
//         variant="outline" 
//         size="sm" 
//         onClick={() => onIncrease(item.id)}
//       >
//         <Plus className="h-2 w-2"/>
//       </Button>
//       <Button 
//         variant="ghost" 
//         size="sm" 
//         onClick={() => onRemove(item.id)}
//       >
//         <Trash2 className="h-4 w-4 text-destructive"/>
//       </Button>
//     </div>
//   </div>
// );

// const Navbar: React.FC = () => {
//   // Use Zustand cart store
//   const { cart, removeFromCart } = useCartStore();

//   const calculateTotal = (): number => {
//     return cart.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
//   };

//   const handleIncreaseQuantity = (id: string): void => {
//     const item = cart.find((cartItem: { id: string; }) => cartItem.id === id);
//     if (item) {
//       useCartStore.getState().addToCart({
//         ...item,
//         quantity: 1
//       });
//     }
//   };

//   const handleDecreaseQuantity = (id: string): void => {
//     const item = cart.find((cartItem: { id: string; }) => cartItem.id === id);
//     if (item && item.quantity > 1) {
//       useCartStore.getState().addToCart({
//         ...item,
//         quantity: -1
//       });
//     } else if (item && item.quantity === 1) {
//       removeFromCart(id);
//     }
//   };



//   return (
//     <nav className="border-t z-50 md:border-b w-full fixed flex items-center px-3 h-16 md:top-0 bottom-0 bg-background">
//       <div className="ml-4 hidden md:flex md:ml-0">
//         <h1 className="text-xl font-bold">Logo</h1>
//       </div>
      
//       {/* Desktop Navigation */}
//       <div className="hidden md:flex items-center space-x-4 ml-8">
//         <Button variant="ghost">Home</Button>
//         <Button variant="ghost">Projects</Button>
//         <Button variant="ghost">Tasks</Button>
//         <Button variant="ghost">Messages</Button>
//       </div>
      
//       {/* Search and Actions */}
//       <div className="md:ml-auto w-full md:w-fit flex justify-between items-center">
//         {/* Search */}
//         <div className="hidden md:flex items-center relative">
//           <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search..."
//             className="w-64 pl-8"
//           />
//         </div>
        
//         <Button variant="ghost" className="justify-center md:hidden">
//           <Search className="h-5 w-5" />
//         </Button>
        
//         <Button variant="ghost" className="justify-center md:hidden">
//           <Bell className="h-5 w-5" />
//         </Button>
        
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="ghost" className="justify-center md:hidden relative">
//               <ShoppingCart className="h-5 w-5" />
//               {cart.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full px-1.5 py-0.5 text-xs">
//                   {cart.length}
//                 </span>
//               )}
//             </Button>
//           </SheetTrigger>
          
//           <SheetContent 
//             side="bottom" 
//             className="h-[95vh] rounded-t-xl w-full"
//           >
//             <div className="h-full flex flex-col">
//               <SheetHeader>
//                 <SheetTitle>Your Cart</SheetTitle>
//               </SheetHeader>
              
//               <div className="mt-4 space-y-4 flex-grow overflow-y-auto">
//                 {cart.length === 0 ? (
//                   <p className="text-center text-muted-foreground">
//                     Your cart is empty
//                   </p>
//                 ) : (
//                   cart.map((item:{ id:string,title: string,description: string,image: string,category: string,type:string,quantity:number,price: number}) => (
//                     <CartItem 
//                       key={item.id}
//                       item={item}
//                       onIncrease={handleIncreaseQuantity}
//                       onDecrease={handleDecreaseQuantity}
//                       onRemove={removeFromCart}
//                     />
//                   ))
//                 )}
//               </div>
              
//               {cart.length > 0 && (
//                 <SheetFooter className="mt-4">
//                   <div className="w-full">
//                     <div className="flex justify-between mb-4">
//                       <span className="font-semibold">Total</span>
//                       <span className="font-bold">${calculateTotal().toFixed(2)}</span>
//                     </div>
//                     <Button 
//                       className="w-full" 
//                       disabled={cart.length === 0}
//                     >
//                       Proceed to Checkout
//                     </Button>
//                   </div>
//                 </SheetFooter>
//               )}
//             </div>
//           </SheetContent>
//         </Sheet>
        
//         <ModeToggle/>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// 'use client'
// import React from 'react';
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { 
//   Search, 
//   Bell 
// } from "lucide-react";
// import { ModeToggle } from './darkMode';
// import { Cart, CartIcon } from '~/app/_components/cart'
// const Navbar: React.FC = () => {
//   return (
//     <nav className="border-t z-50 md:border-b w-full fixed flex items-center px-3 h-16 md:top-0 bottom-0 bg-background">
//       <div className="ml-4 hidden md:flex md:ml-0">
//         <h1 className="text-xl font-bold">Logo</h1>
//       </div>
      
//       {/* Desktop Navigation */}
//       <div className="hidden md:flex items-center space-x-4 ml-8">
//         <Button variant="ghost">Home</Button>
//         <Button variant="ghost">Product</Button>
//         <Button variant="ghost"></Button>
//         <Button variant="ghost">Cart</Button>
//       </div>
      
//       {/* Search and Actions */}
//       <div className="md:ml-auto w-full md:w-fit flex justify-between items-center">
//         {/* Search */}
//         <div className="hidden md:flex items-center relative">
//           <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search..."
//             className="w-64 pl-8"
//           />
//         </div>
        
//         <Button variant="ghost" className="justify-center md:hidden">
//           <Search className="h-5 w-5" />
//         </Button>
        
//         <Button variant="ghost" className="justify-center md:hidden">
//           <Bell className="h-5 w-5" />
//         </Button>
        
//         {/* Use the Cart component */}
//         <Cart />
        
//         <ModeToggle/>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


'use client'
import React from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Search, 
  Bell,
  LogOut 
} from "lucide-react";
import { ModeToggle } from './darkMode';
import { Cart } from '~/app/_components/cart'
import { useSession, signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
   await signOut({ 
      callbackUrl: '/auth/login' 
    });
  };

  return (
    <nav className="border-t z-50 md:border-b w-full fixed flex items-center px-3 h-16 md:top-0 bottom-0 bg-background">
      <div className="ml-4 hidden md:flex md:ml-0">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4 ml-8">
        <Button variant="ghost">Home</Button>
        <Button variant="ghost">Product</Button>
        <Button variant="ghost"></Button>
        <Button variant="ghost">Cart</Button>
      </div>
      
      {/* Search and Actions */}
      <div className="md:ml-auto w-full md:w-fit flex justify-between items-center">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-8"
          />
        </div>
        
        {/* Mobile Search Button */}
        <Button variant="ghost" className="justify-center md:hidden">
          <Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" className="justify-center md:hidden">
          <Bell className="h-5 w-5" />
        </Button>
        
        {/* Logout Button - Desktop and Mobile */}
        {session && (
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="justify-center"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
        
        {/* Use the Cart component */}
        <Cart />
        
        <ModeToggle/>
      </div>
    </nav>
  );
};

export default Navbar;