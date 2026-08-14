import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { basePath } = useStore();
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p className="store-empty">Your cart is empty.</p>
        <Link to={`${basePath}/products`} className="hero-button">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.variant_id}>
              <td>
                {item.product_name}
                <div className="muted">{item.color} {item.size}</div>
              </td>
              <td>৳{item.unit_price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => cart.updateQuantity(item.variant_id, Number(e.target.value))}
                />
              </td>
              <td>৳{item.unit_price * item.quantity}</td>
              <td>
                <button className="remove-link" onClick={() => cart.removeItem(item.variant_id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div>Subtotal: <strong>৳{cart.subtotal}</strong></div>
        <Link to={`${basePath}/checkout`} className="hero-button">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
