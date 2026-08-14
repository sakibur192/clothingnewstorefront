// ============================================================
// STORE LAYOUT
// ============================================================
// Wraps every storefront page with theme context, cart/wishlist
// context, header, announcement bar, footer, WhatsApp floating
// button, recent-activity social-proof popup, and a mobile bottom
// nav bar. forcedSubdomain is passed down from App.jsx when
// running in "root mode" (a real custom domain).
// ============================================================

import { Outlet } from "react-router-dom";
import { StoreProvider, useStore } from "../context/StoreContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import Header from "./Header";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import RecentActivityPopup from "./RecentActivityPopup";
import MobileBottomNav from "./MobileBottomNav";

function LayoutInner() {
  const { loading, error } = useStore();

  if (loading) return <div className="store-loading-page">Loading store...</div>;
  if (error) return <div className="store-loading-page">Store not found.</div>;

  return (
    <div className="storefront-app">
      <AnnouncementBar />
      <Header />
      <main className="store-main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <RecentActivityPopup />
      <MobileBottomNav />
    </div>
  );
}

export default function StoreLayout({ forcedSubdomain }) {
  return (
    <StoreProvider forcedSubdomain={forcedSubdomain}>
      <CartProvider>
        <WishlistProvider>
          <LayoutInner />
        </WishlistProvider>
      </CartProvider>
    </StoreProvider>
  );
}
