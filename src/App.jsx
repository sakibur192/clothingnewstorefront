// ============================================================
// APP - ROUTES
// ============================================================
// Supports TWO ways of reaching a store, decided ONCE at startup
// (never both at the same time, so there's no routing ambiguity):
//
//   ROOT MODE (real custom domain / production): before any
//   routes are even mounted, this checks whether the browser's
//   hostname itself resolves to a business (via
//   GET /public/resolve?host=<hostname>). If it does - meaning
//   someone is visiting, say, abcfashion.com directly - every
//   route is mounted at the root ("/", "/products", "/cart", ...)
//   with NO subdomain in the URL. That's what makes a custom
//   domain feel like the business's own site.
//
//   PATH MODE (dev/testing fallback): if the hostname doesn't
//   resolve to anything (e.g. you're on localhost, or this
//   sandbox's preview URL), every route is mounted under
//   /:subdomain/... instead - exactly how earlier phases worked,
//   so nothing about local testing changes.
// ============================================================

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StoreLayout from "./components/StoreLayout";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import DynamicPage from "./pages/DynamicPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import TrackOrder from "./pages/TrackOrder";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerAccount from "./pages/CustomerAccount";
import { resolveByHost } from "./api/api";

function Landing() {
  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Storefront App</h1>
      <p>Visit /&lt;your-store-subdomain&gt; to view a store, e.g. <code>/abc-fashion-123</code>.</p>
      <p style={{ color: "#6b7280", fontSize: 14 }}>
        (Real custom domains skip this - they route straight to the store's homepage.)
      </p>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("checking"); // 'checking' | 'root' | 'path'
  const [resolvedSubdomain, setResolvedSubdomain] = useState(null);

  useEffect(() => {
    resolveByHost(window.location.hostname)
      .then((data) => {
        setResolvedSubdomain(data.subdomain);
        setMode("root");
      })
      .catch(() => setMode("path"));
  }, []);

  if (mode === "checking") {
    return <div className="store-loading-page">Loading...</div>;
  }

  if (mode === "root") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StoreLayout forcedSubdomain={resolvedSubdomain} />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="page/:slug" element={<DynamicPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="login" element={<CustomerLogin />} />
            <Route path="register" element={<CustomerRegister />} />
            <Route path="account" element={<CustomerAccount />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:subdomain" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="page/:slug" element={<DynamicPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="register" element={<CustomerRegister />} />
          <Route path="account" element={<CustomerAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
