import { create } from "zustand";
import { persist } from "zustand/middleware";


interface CartItem {
  id: string;
  title: string;
  image: string;
  description:string
  category:{_id:string,name:string}
  price: number;
  type:string;
  quantity: number;
  stock:number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartItemIds: () => string[];
}

const useCartStore = create(
  persist<CartState>(
    (set,get) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            };
          } else {
            return { cart: [...state.cart, item] };
          }
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((cartItem) => cartItem.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
      getCartItemIds: () => {
        return get().cart.map(item => item.id);
      },
      
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
