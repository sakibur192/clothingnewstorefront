// ============================================================
// CHECKOUT PAGE
// ============================================================
// If the customer is logged in, their name/phone come from their
// account (no re-typing), and the order links to their account
// automatically. If not, a "Log in" link is offered but guest
// checkout still works exactly as before - login is never forced.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkout } from "../api/api";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function Checkout() {
  const { subdomain, basePath } = useStore();
  const cart = useCart();
  const { customer } = useCustomerAuth() || {};
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
      setAddress(customer.address || "");
    }
  }, [customer]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);

    try {
      const payload = {
        items: cart.items.map((i) => ({
          variant_id: i.variant_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
        payment_method: paymentMethod,
        shipping_address: address,
      };

      // logged-in customers don't need new_customer - the account
      // is attached automatically from their token on the backend
      if (!customer) {
        payload.new_customer = { name, phone, address };
      }

      const data = await checkout(subdomain, payload);
      setConfirmedOrder(data.order);
      cart.clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="checkout-page">
        <h1>Order Placed!</h1>
        <p>Your order number is <strong>{confirmedOrder.order_number}</strong>.</p>
        <p>Total: ৳{confirmedOrder.total} — Payment: {confirmedOrder.payment_method.toUpperCase()}</p>
        {customer ? (
          <p className="muted">
            You can track this order anytime from <Link to={`${basePath}/account`}>My Account</Link>.
          </p>
        ) : (
          <p className="muted">
            We'll contact you soon to confirm delivery. Want to track it easily next time?{" "}
            <Link to={`${basePath}/register`}>Create an account</Link>.
          </p>
        )}
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p className="store-empty">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {!customer && (
        <p className="muted" style={{ marginBottom: 16 }}>
          <Link to={`${basePath}/login`}>Log in</Link> for faster checkout, or continue as a guest below.
        </p>
      )}

      {error && <p className="store-error">{error}</p>}

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required disabled={!!customer} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={!!customer} />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cod">Cash on Delivery</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
            </select>
          </div>
          <button type="submit" className="add-to-cart-btn" disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div className="checkout-summary-line" key={item.variant_id}>
              <span>{item.product_name} ({item.color} {item.size}) x{item.quantity}</span>
              <span>৳{item.unit_price * item.quantity}</span>
            </div>
          ))}
          <div className="checkout-summary-total">
            <strong>Total: ৳{cart.subtotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
