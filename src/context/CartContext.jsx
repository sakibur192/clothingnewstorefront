// ============================================================
// CART CONTEXT
// ============================================================
// Simple client-side cart, saved to localStorage keyed by
// subdomain (so switching between two different demo stores in
// the same browser doesn't mix their carts).
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import { useStore } from "./StoreContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { subdomain } = useStore() || {};
  const storageKey = `cart_${subdomain}`;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!subdomain) return;
    const saved = localStorage.getItem(storageKey);
    setItems(saved ? JSON.parse(saved) : []);
  }, [subdomain]);

  function persist(next) {
    setItems(next);
    if (subdomain) localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function addItem(variant, product, quantity = 1) {
    const existing = items.find((i) => i.variant_id === variant.id);
    if (existing) {
      persist(
        items.map((i) => (i.variant_id === variant.id ? { ...i, quantity: i.quantity + quantity } : i))
      );
    } else {
      persist([
        ...items,
        {
          variant_id: variant.id,
          product_id: product.id,
          product_name: product.name,
          color: variant.color,
          size: variant.size,
          unit_price: Number(variant.sale_price || variant.regular_price),
          stock: variant.stock_quantity,
          quantity,
        },
      ]);
    }
  }

  function updateQuantity(variantId, quantity) {
    persist(items.map((i) => (i.variant_id === variantId ? { ...i, quantity } : i)));
  }

  function removeItem(variantId) {
    persist(items.filter((i) => i.variant_id !== variantId));
  }

  function clearCart() {
    persist([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
