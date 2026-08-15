// ============================================================
// CUSTOMER AUTH CONTEXT
// ============================================================
// Separate from the cart/wishlist contexts, but follows the same
// per-subdomain localStorage pattern. Tracks whether a customer
// is logged in to THIS store and exposes their profile.
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import { useStore } from "./StoreContext";
import { getCustomerProfile } from "../api/api";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const { subdomain } = useStore() || {};
  const storageKey = `customer_token_${subdomain}`;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subdomain) return;
    const token = localStorage.getItem(storageKey);
    if (!token) {
      setLoading(false);
      return;
    }
    getCustomerProfile(subdomain)
      .then((data) => setCustomer(data.customer))
      .catch(() => localStorage.removeItem(storageKey))
      .finally(() => setLoading(false));
  }, [subdomain]);

  function login(token, customerData) {
    localStorage.setItem(storageKey, token);
    setCustomer(customerData);
  }

  function logout() {
    localStorage.removeItem(storageKey);
    setCustomer(null);
  }

  function updateProfile(customerData) {
    setCustomer(customerData);
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, login, logout, updateProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
