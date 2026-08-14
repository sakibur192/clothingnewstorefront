// ============================================================
// FOOTER
// ============================================================
// Multi-column footer matching real e-commerce sites: about
// blurb, quick links, customer service links, contact info, and
// a payment-methods row. Payment "icons" are styled text badges
// (bKash/Nagad/COD/Visa/Mastercard) since no icon asset library
// is used in this project.
// ============================================================

import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const PAYMENT_METHODS = ["bKash", "Nagad", "Rocket", "COD", "Visa", "Mastercard"];

export default function Footer() {
  const { basePath, store } = useStore();
  const storeName = store?.settings?.store_name || store?.business?.name || "Store";
  const supportPhone = store?.settings?.support_phone;

  return (
    <footer className="store-footer">
      <div className="footer-columns">
        <div className="footer-column">
          <div className="footer-logo">{storeName}</div>
          <p className="footer-about">
            Quality clothing, delivered across Bangladesh. Thank you for shopping with us.
          </p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          <Link to={`${basePath}/products`}>All Products</Link>
          <Link to={`${basePath}/products?collection=bestsellers`}>Best Sellers</Link>
          <Link to={`${basePath}/wishlist`}>Wishlist</Link>
        </div>

        <div className="footer-column">
          <h4>Customer Service</h4>
          {store?.pages
            ?.filter((p) => p.slug !== "home")
            .map((p) => (
              <Link key={p.slug} to={`${basePath}/page/${p.slug}`}>{p.title}</Link>
            ))}
          <Link to={`${basePath}/track-order`}>Track Your Order</Link>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          {supportPhone && <p>📞 {supportPhone}</p>}
          <p>Available 10am — 8pm, everyday</p>
        </div>
      </div>

      <div className="footer-payments">
        {PAYMENT_METHODS.map((m) => (
          <span key={m} className="payment-badge">{m}</span>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
