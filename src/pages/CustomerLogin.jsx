import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { customerLogin } from "../api/api";

export default function CustomerLogin() {
  const { subdomain, basePath } = useStore();
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await customerLogin(subdomain, { phone, password });
      login(data.token, data.customer);
      navigate(`${basePath}/account`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-storefront">
      <div className="auth-box-storefront">
        <h1>Log In</h1>
        <p className="muted">Log in to track orders and check out faster.</p>

        {error && <p className="store-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="add-to-cart-btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
          New here? <Link to={`${basePath}/register`}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
