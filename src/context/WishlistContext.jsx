// ============================================================
// WISHLIST CONTEXT
// ============================================================
// Client-side wishlist, saved to localStorage keyed by subdomain
// (same pattern as CartContext). No backend storage in Phase 3/4 -
// this is a "save for later" convenience, not a synced account
// feature (that would need customer login on the storefront,
// which doesn't exist yet).
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import { useStore } from "./StoreContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { subdomain } = useStore() || {};
  const storageKey = `wishlist_${subdomain}`;
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

  function isWishlisted(productId) {
    return items.some((i) => i.product_id === productId);
  }

  function toggleWishlist(product) {
    if (isWishlisted(product.id)) {
      persist(items.filter((i) => i.product_id !== product.id));
    } else {
      persist([...items, { product_id: product.id, name: product.name, added_at: Date.now() }]);
    }
  }

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
