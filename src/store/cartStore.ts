
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product: Product) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            total: state.total + product.price
          }));
        } else {
          set(state => ({
            items: [...state.items, { product, quantity: 1 }],
            total: state.total + product.price
          }));
        }
      },
      removeItem: (productId: string) => {
        const items = get().items;
        const item = items.find(item => item.product.id === productId);
        if (item) {
          set(state => ({
            items: state.items.filter(item => item.product.id !== productId),
            total: state.total - (item.product.price * item.quantity)
          }));
        }
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const items = get().items;
        const item = items.find(item => item.product.id === productId);
        if (item) {
          const priceDiff = (quantity - item.quantity) * item.product.price;
          set(state => ({
            items: state.items.map(item =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            ),
            total: state.total + priceDiff
          }));
        }
      },
      clearCart: () => set({ items: [], total: 0 }),
      getItemCount: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
