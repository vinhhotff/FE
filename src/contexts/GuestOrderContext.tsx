'use client';

import { MenuItem } from '@/types';
import { ReactNode, createContext, useContext, useState, useMemo } from 'react';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

interface GuestOrderContextType {
  guestName: string;
  setGuestName: (name: string) => void;
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  resetCart: () => void;
  total: number;
}

const GuestOrderContext = createContext<GuestOrderContextType | undefined>(undefined);

export const useGuestOrderContext = () => {
  const ctx = useContext(GuestOrderContext);
  if (!ctx) throw new Error('useGuestOrderContext must be used inside GuestOrderProvider');
  return ctx;
};

export const GuestOrderProvider = ({ children }: { children: ReactNode }) => {
  const [guestName, setGuestName] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.menuItem._id === menuItem._id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { menuItem, quantity }];
    });
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.menuItem._id !== id));
  const updateQuantity = (id: string, qty: number) => setCart((c) => c.map((i) => (i.menuItem._id === id ? { ...i, quantity: qty } : i)));
  const resetCart = () => setCart([]);
  const total = useMemo(() => cart.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0), [cart]);

  return <GuestOrderContext.Provider value={{ guestName, setGuestName, cart, addToCart, removeFromCart, updateQuantity, resetCart, total }}>{children}</GuestOrderContext.Provider>;
};

