// ============================================================
// CUSTOMER ACCOUNT (Profile + Order History)
// ============================================================
// Two tabs: Profile (view/edit own info) and Orders (their own
// order history, pulled from /my/orders - not the guest
// track-order flow, this is a real authenticated account view).
// ============================================================

import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { getMyOrders, updateCustomerProfile } from "../api/api";

const STATUS_BADGE = {
  pending: "pending", confirmed: "confirmed", packed: "packed",
  shipped: "shipped", delivered: "delivered", cancelled: "cancelled", returned: "returned",
};

export default function CustomerAccount() {
  const { subdomain, basePath } = useStore();
  const { customer, loading: authLoading, logout, updateProfile } = useCustomerAuth();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!customer) return;
    setForm({ name: customer.name || "", email: customer.email || "", address: customer.address || "" });
    getMyOrders(subdomain).then((data) => setOrders(data.orders)).finally(() => setOrdersLoading(false));
  }, [customer, subdomain]);

  if (authLoading) return <p className="store-loading">Loading...</p>;
  if (!customer) return <Navigate to={`${basePath}/login`} replace />;

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const data = await updateCustomerProfile(subdomain, form);
      updateProfile(data.customer);
      setMessage("Profile updated.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="checkout-page">
      <div className="account-header">
        <h1>My Account</h1>
        <button className="btn-notify" onClick={logout}>Log Out</button>
      </div>
      <p className="muted">Welcome back, {customer.name} ({customer.phone})</p>

      <div className="account-tabs">
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>My Orders</button>
        <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Profile</button>
      </div>

      {tab === "orders" && (
        <div>
          {ordersLoading ? (
            <p className="store-loading">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="store-empty">
              No orders yet. <Link to={`${basePath}/products`}>Start shopping</Link>
            </div>
          ) : (
            <table className="cart-table">
              <thead>
                <tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.order_number}</td>
                    <td className="muted">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="muted">{o.item_count}</td>
                    <td>৳{o.total}</td>
                    <td><span className={`order-status-badge status-${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "profile" && (
        <form onSubmit={handleSaveProfile} className="checkout-form" style={{ maxWidth: 420 }}>
          {message && <p className="muted">{message}</p>}
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={customer.phone} disabled />
          </div>
          <div className="form-group">
            <label>Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Default Delivery Address</label>
            <textarea value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
          <button type="submit" className="add-to-cart-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
