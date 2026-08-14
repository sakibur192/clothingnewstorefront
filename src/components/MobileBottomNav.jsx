import { Link, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function MobileBottomNav() {
  const { basePath } = useStore();
  const cart = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link to={basePath || "/"} className={isActive(basePath || "/") ? "active" : ""}>
        <span>🏠</span>Home
      </Link>
      <Link to={`${basePath}/products`} className={isActive(`${basePath}/products`) ? "active" : ""}>
        <span>🗂️</span>Shop
      </Link>
      <Link to={`${basePath}/cart`} className={isActive(`${basePath}/cart`) ? "active" : ""}>
        <span style={{ position: "relative" }}>
          🛒
          {cart?.itemCount > 0 && <span className="cart-badge" style={{ top: -6, right: -10 }}>{cart.itemCount}</span>}
        </span>
        Cart
      </Link>
      <Link to={`${basePath}/wishlist`} className={isActive(`${basePath}/wishlist`) ? "active" : ""}>
        <span>♡</span>Wishlist
      </Link>
      <Link to={`${basePath}/track-order`} className={isActive(`${basePath}/track-order`) ? "active" : ""}>
        <span>📦</span>Track
      </Link>
    </nav>
  );
}
