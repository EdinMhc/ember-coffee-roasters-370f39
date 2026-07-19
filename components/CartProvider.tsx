'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number, grind: CartItem['grind']) => void;
  removeItem: (productId: number, grind: CartItem['grind']) => void;
  updateQuantity: (
    productId: number,
    grind: CartItem['grind'],
    quantity: number
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'ember-cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silently ignore
  }
}

const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_COST = 4.9;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Persist whenever items change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveCart(items);
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, quantity: number, grind: CartItem['grind']) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.grind === grind
        );
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id && i.grind === grind
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { product, quantity, grind }];
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: number, grind: CartItem['grind']) => {
      setItems((prev) =>
        prev.filter(
          (i) => !(i.product.id === productId && i.grind === grind)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number, grind: CartItem['grind'], quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, grind);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.grind === grind
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  const shipping = useMemo(
    () => (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST),
    [subtotal]
  );

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      shipping,
      total,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, shipping, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
