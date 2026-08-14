// ============================================================
// STOREFRONT HEADER
// ============================================================
// Sticky header with a small utility top bar (phone/delivery
// info), logo, search, and account/wishlist/cart icons - the
// layout real BD fashion sites (Fabrilife, Sara Lifestyle, etc.)
// use. Search submits to the product list page with a `search`
// query param the backend already supports.
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Header() {
  const { basePath, store } = useStore();
  const cart = useCart();
  const wishlist = useWishlist();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName = store?.settings?.store_name || store?.business?.name || "Store";
  const supportPhone = store?.settings?.support_phone;

  function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`${basePath}/products?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  }

  return (
    <>
      {supportPhone && (
        <div className="store-utility-bar">
          <span>📞 {supportPhone} — We're here to help</span>
          <span>Free delivery inside Dhaka on eligible orders</span>
        </div>
      )}

      <header className="store-header">
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          ☰
        </button>

        <Link to={basePath || "/"} className="store-logo">
          {store?.settings?.logo_url ? <img src={store.settings.logo_url} alt={storeName} /> : storeName}
        </Link>

        <form className="store-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>

        <nav className={menuOpen ? "store-nav open" : "store-nav"}>
          <Link to={basePath || "/"} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to={`${basePath}/products`} onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to={`${basePath}/track-order`} onClick={() => setMenuOpen(false)}>Track Order</Link>
          <Link to={`${basePath}/track-order`} onClick={() => setMenuOpen(false)}>Track Order</Link>
          {store?.pages
            ?.filter((p) => p.slug !== "home")
            .map((p) => (
              <Link key={p.slug} to={`${basePath}/page/${p.slug}`} onClick={() => setMenuOpen(false)}>
                {p.title}
              </Link>
            ))}
        </nav>

        <div className="store-header-icons">
          <Link to={`${basePath}/wishlist`} className="header-icon-link" aria-label="Wishlist">
            ♡
            {wishlist?.items.length > 0 && <span className="cart-badge">{wishlist.items.length}</span>}
          </Link>
          <Link to={`${basePath}/cart`} className="header-icon-link" aria-label="Cart">
            🛒
            {cart?.itemCount > 0 && <span className="cart-badge">{cart.itemCount}</span>}
          </Link>
        </div>
      </header>
    </>
  );
}
