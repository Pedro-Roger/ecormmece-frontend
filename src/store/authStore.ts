import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { useCartStore } from "./cartStore"; // IMPORTAÇÃO DO CARRINHO

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,

      login: (token: string, user: User) => {
        
        useCartStore.getState().clearCart();

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        
        useCartStore.getState().clearCart();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
