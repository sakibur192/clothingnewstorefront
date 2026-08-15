// ============================================================
// STOREFRONT HEADER
// ============================================================
// Sticky header with a small utility top bar (phone/delivery
// info), logo, search, a Shop dropdown listing real categories
// (a practical version of Fabrilife's mega menu - full nested
// sub-category menus would need a category hierarchy admin UI
// this project doesn't have yet), and account/wishlist/cart icons.
// ============================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { listCategories } from "../api/api";

export default function Header() {
  const { basePath, store, subdomain } = useStore();
  const cart = useCart();
  const wishlist = useWishlist();
  const { customer, logout } = useCustomerAuth() || {};
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const storeName = store?.settings?.store_name || store?.business?.name || "Store";
  const supportPhone = store?.settings?.support_phone;

  useEffect(() => {
    if (!subdomain) return;
    listCategories(subdomain).then((data) => setCategories(data.categories)).catch(() => {});
  }, [subdomain]);

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

          <div
            className="shop-dropdown-wrapper"
            onMouseEnter={() => setShopMenuOpen(true)}
            onMouseLeave={() => setShopMenuOpen(false)}
          >
            <Link to={`${basePath}/products`} onClick={() => setMenuOpen(false)}>Shop &#9662;</Link>
            {shopMenuOpen && categories.length > 0 && (
              <div className="shop-dropdown-panel">
                {categories.map((c) => (
                  <Link key={c.id} to={`${basePath}/products?category=${c.id}`} onClick={() => { setMenuOpen(false); setShopMenuOpen(false); }}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

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
          <div
            className="account-dropdown-wrapper"
            onMouseEnter={() => setAccountMenuOpen(true)}
            onMouseLeave={() => setAccountMenuOpen(false)}
          >
            {customer ? (
              <>
                <Link to={`${basePath}/account`} className="header-icon-link" aria-label="My Account">
                  👤
                </Link>
                {accountMenuOpen && (
                  <div className="shop-dropdown-panel account-dropdown-panel">
                    <span className="account-dropdown-greeting">Hi, {customer.name?.split(" ")[0]}</span>
                    <Link to={`${basePath}/account`}>My Orders</Link>
                    <button type="button" onClick={logout}>Log Out</button>
                  </div>
                )}
              </>
            ) : (
              <Link to={`${basePath}/login`} className="header-icon-link" aria-label="Login">
                👤
              </Link>
            )}
          </div>
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
