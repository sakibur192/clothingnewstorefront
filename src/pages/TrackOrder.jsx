import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { trackOrder } from "../api/api";

const STATUS_STEPS = ["pending", "confirmed", "packed", "shipped", "delivered"];

export default function TrackOrder() {
  const { subdomain } = useStore();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const data = await trackOrder(subdomain, { order_number: orderNumber.trim(), phone: phone.trim() });
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isCancelledOrReturned = order && (order.status === "cancelled" || order.status === "returned");

  return (
    <div className="checkout-page">
      <h1>Track Your Order</h1>
      <p className="muted">Enter your order number and the phone number you used at checkout.</p>

      <form onSubmit={handleSubmit} className="checkout-form" style={{ maxWidth: 420 }}>
        <div className="form-group">
          <label>Order Number</label>
          <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="ORD-..." required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <button className="add-to-cart-btn" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {error && <p className="store-error">{error}</p>}

      {order && (
        <div className="checkout-summary" style={{ marginTop: 24, maxWidth: 500 }}>
          <h3>Order {order.order_number}</h3>

          {isCancelledOrReturned ? (
            <p style={{ color: "#b91c1c", fontWeight: 700 }}>
              This order was {order.status}.
            </p>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: "50%", margin: "0 auto 6px",
                      background: i <= currentStepIndex ? "var(--store-primary)" : "#e5e1da",
                    }}
                  />
                  <div style={{ fontSize: 11, textTransform: "capitalize", color: i <= currentStepIndex ? "var(--store-primary)" : "#9ca3af" }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          )}

          {order.courier && (
            <p className="muted">
              Courier: {order.courier.courier_name} — {order.courier.status}
            </p>
          )}

          <div className="checkout-summary-line"><span>Total</span><span>৳{order.total}</span></div>
          <div className="checkout-summary-line"><span>Payment</span><span>{order.payment_method.toUpperCase()} — {order.payment_status}</span></div>

          <h4 style={{ marginTop: 16 }}>Items</h4>
          {order.items.map((item) => (
            <div className="checkout-summary-line" key={item.id}>
              <span>{item.product_name} ({item.color} {item.size}) x{item.quantity}</span>
              <span>৳{item.line_total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
