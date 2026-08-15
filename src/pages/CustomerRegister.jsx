import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { customerRegister } from "../api/api";

export default function CustomerRegister() {
  const { subdomain, basePath } = useStore();
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await customerRegister(subdomain, { name, phone, password });
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
        <h1>Create Account</h1>
        <p className="muted">Just your phone number and a password — that's it.</p>

        {error && <p className="store-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            <span className="muted" style={{ fontSize: 11 }}>At least 6 characters</span>
          </div>
          <button type="submit" className="add-to-cart-btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
          Already have an account? <Link to={`${basePath}/login`}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
